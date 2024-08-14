import React, { useEffect } from "react";
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import { api } from "common";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import moment from "moment";

function AuthLoading(props) {
  const { t } = useTranslation();
  const {
    fetchUser,
    fetchCarTypes,
    fetchSettings,
    fetchBookings,
    fetchCancelReasons,
    fetchPromos,
    fetchDriverEarnings,
    fetchUsers,
    fetchNotifications,
    fetchEarningsReport,
    signOff,
    fetchWithdraws,
    fetchPaymentMethods,
    fetchLanguages,
    fetchWalletHistory,
    fetchCars,
    fetchComplain,
    fetchSMTP,
    fetchSos,
    fetchSMSConfig,
    fetchFleetAdminEarnings
  } = api;

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const languagedata = useSelector((state) => state.languagedata);
  const settingsdata = useSelector((state) => state.settingsdata);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch, fetchSettings]);

  useEffect(() => {
    if (languagedata.langlist) {
      const obj = {};
      let def1 = {};
      languagedata.langlist.forEach((value) => {
        obj[value.langLocale] = value.keyValuePairs;
        if (value.default) {
          def1 = value;
        }
      });

      const result = localStorage.getItem('lang');
      const langData = result ? JSON.parse(result) : {};
      const langLocale = langData.langLocale || def1.langLocale;
      // const dateLocale = langData.dateLocale || def1.dateLocale;

      if (langLocale) {
        i18n.addResourceBundle(langLocale, "translations", obj[langLocale] || {});
        i18n.changeLanguage(langLocale);
        // moment.locale(dateLocale);
      }

      dispatch(fetchUser());
    }
  }, [languagedata, dispatch, fetchUser]);

  useEffect(() => {
    if (settingsdata.settings) {
      document.title = settingsdata.settings.appName;
      dispatch(fetchLanguages());
      dispatch(fetchCarTypes());
    }
  }, [settingsdata.settings, dispatch, fetchLanguages, fetchCarTypes]);

  useEffect(() => {
    if (auth.profile) {
      const role = auth.profile.usertype;
      switch (role) {
        case "customer":
          dispatch(fetchBookings());
          dispatch(fetchWalletHistory());
          dispatch(fetchPaymentMethods());
          dispatch(fetchCancelReasons());
          dispatch(fetchUsers());
          break;
        case "driver":
          dispatch(fetchBookings());
          dispatch(fetchWithdraws());
          dispatch(fetchPaymentMethods());
          dispatch(fetchCars());
          dispatch(fetchWalletHistory());
          break;
        case "admin":
          dispatch(fetchUsers());
          dispatch(fetchBookings());
          dispatch(fetchPromos());
          dispatch(fetchDriverEarnings());
          dispatch(fetchFleetAdminEarnings());
          dispatch(fetchNotifications());
          dispatch(fetchEarningsReport());
          dispatch(fetchCancelReasons());
          dispatch(fetchWithdraws());
          dispatch(fetchComplain());
          dispatch(fetchPaymentMethods());
          dispatch(fetchCars());
          dispatch(fetchSMTP());
          dispatch(fetchSMSConfig());
          dispatch(fetchSos());
          break;
        case "fleetadmin":
          dispatch(fetchUsers());
          dispatch(fetchBookings());
          dispatch(fetchDriverEarnings());
          dispatch(fetchCars());
          dispatch(fetchCancelReasons());
          dispatch(fetchPaymentMethods());
          dispatch(fetchWalletHistory());
          break;
        default:
          alert(t("not_valid_user_type"));
          dispatch(signOff());
      }
    } else {
      alert(t("user_issue_contact_admin"));
      dispatch(signOff());
    }
  }, [
    auth.profile,
    dispatch,
    fetchBookings,
    fetchCancelReasons,
    fetchDriverEarnings,
    fetchEarningsReport,
    fetchNotifications,
    fetchPromos,
    fetchUsers,
    fetchWithdraws,
    signOff,
    fetchPaymentMethods,
    fetchWalletHistory,
    fetchCars,
    fetchComplain,
    fetchSMTP,
    fetchSMSConfig,
    fetchSos,
    fetchFleetAdminEarnings,
    t
  ]);

  if (settingsdata.loading) {
    return <CircularLoading />;
  }

  if (settingsdata.settings) {
    if (auth.loading || !languagedata.langlist) {
      return <CircularLoading />;
    }
    return props.children;
  }

  return (
    <div>
      <span>No Database Settings found</span>
    </div>
  );
}

export default AuthLoading;
