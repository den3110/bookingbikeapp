import React, { useState, useEffect, useRef } from "react";
import { downloadCsv } from "../common/sharedFunctions";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from "common";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { colors } from "../components/Theme/WebTheme";
import { Typography  } from "@mui/material";
import AlertDialog from "../components/AlertDialog";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import moment from 'moment';
import {MAIN_COLOR,SECONDORY_COLOR} from "../common/sharedFunctions"
import EditIcon from '@mui/icons-material/Edit';
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function Users() {
  const navigate = useNavigate();
  const {id} = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editUser,
    deleteUser,
    fetchUsersOnce,
  } = api;
  const settings = useSelector((state) => state.settingsdata.settings);
  const [data, setData] = useState([]);
  const [sortedData, SetSortedData] = useState([]);
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const loaded = useRef(false);
  
  useEffect(() => {
    dispatch(fetchUsersOnce());
  }, [dispatch, fetchUsersOnce]);

  useEffect(() => {
    if (staticusers) {
      setData(
        staticusers.filter(
          (user) =>
            user.usertype === "customer" &&
            ((user.fleetadmin === auth.profile.uid &&
              auth.profile.usertype === "fleetadmin") ||
              auth.profile.usertype === "admin")
        )
      );
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [staticusers, auth.profile]);

  useEffect(()=>{
    if(data){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data,sortedData])

  const columns = [
    { title: t('createdAt'), field: 'createdAt', editable:'never', defaultSort:'desc',render: rowData => rowData.createdAt? moment(rowData.createdAt).format('lll'):null},

    { title: t("first_name"), field: "firstName" },
    { title: t("last_name"), field: "lastName" },
    {
      title: t("mobile"),
      field: "mobile",
      editable: "onAdd",
      render: (rowData) =>
        settings.AllowCriticalEditsAdmin ? rowData.mobile : t("hidden_demo"),
    },
    {
      title: t("email"),
      field: "email",
      editable: "onAdd",
      render: (rowData) =>
        settings.AllowCriticalEditsAdmin ? rowData.email : t("hidden_demo"),
    },
    {
      title: t("profile_image"),
      field: "profile_image",
      render: (rowData) =>
        rowData.profile_image ? (
          <img
            alt="Profile"
            src={rowData.profile_image}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          <AccountCircleIcon sx={{ fontSize: 40 }} />
        ),
      editable: "never",
    },
    {
      title: t("account_approve"),
      field: "approved",
      type: "boolean",
      render: (rowData) => (
        <Switch
          disabled={!settings.AllowCriticalEditsAdmin}
          checked={rowData.approved}
          onChange={() => handelApproved(rowData)}
        />
      ),
    },
  ];


  const [selectedRow, setSelectedRow] = useState(null);

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handelApproved = (rowData) => {
    const updatedUser = { ...rowData, approved: !rowData.approved };
    dispatch(editUser(updatedUser.id, updatedUser));
    dispatch(fetchUsersOnce());
    return updatedUser;
  };

  return !loaded.current ? (
    <CircularLoading />
  ) : (
    <div>
      <ThemeProvider theme={theme}>
      <MaterialTable
        title={t("riders_title")}
        columns={columns}
        style={{
          direction: isRTL === "rtl" ? "rtl" : "ltr",
          borderRadius: "8px",
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
          padding: "20px",
        }}
        data={sortedData}
        onRowClick={(evt, selectedRow) =>
          setSelectedRow(selectedRow.tableData.id)
        }
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 15, 20],
          exportCsv: (columns, data) => {
            let hArray = [];
            const headerRow = columns.map((col) => {
              if (typeof col.title === "object") {
                return col.title.props.text;
              }
              hArray.push(col.field);
              return col.title;
            });
            const dataRows = data.map(({ tableData, ...row }) => {
              row.createdAt =
                new Date(row.createdAt).toLocaleDateString() +
                " " +
                new Date(row.createdAt).toLocaleTimeString();
              let dArr = [];
              for (let i = 0; i < hArray.length; i++) {
                dArr.push(row[hArray[i]]);
              }
              return Object.values(dArr);
            });
            const { exportDelimiter } = ",";
            const delimiter = exportDelimiter ? exportDelimiter : ",";
            const csvContent = [headerRow, ...dataRows]
              .map((e) => e.join(delimiter))
              .join("\n");
            const csvFileName = "download.csv";
            downloadCsv(csvContent, csvFileName);
          },
          exportButton: {
            csv: settings.AllowCriticalEditsAdmin,
            pdf: false,
          },
          maxColumnSort: "all_columns",
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
          }),
          editable: {
            backgroundColor: colors.Header_Text,
            fontSize: "0.8em",
            fontWeight: "bold ",
          },
          headerStyle: {
            color: colors.Black,
            position: "sticky",
            top: "0px",
            backgroundColor:SECONDORY_COLOR,
            textAlign: "center",
            fontSize: "0.8em",
            fontWeight: "bold ",
            border: `1px solid ${colors.TABLE_BORDER}`,
          },
          cellStyle: {
            border: `1px solid ${colors.TABLE_BORDER}`,
            textAlign: "center",
          },
          actionsColumnIndex: -1,
        }}
        localization={{
          body: {
            addTooltip: t("add"),
            deleteTooltip: t("delete"),
            editTooltip: t("edit"),
            emptyDataSourceMessage: t("blank_message"),
            editRow: {
              deleteText: t("delete_message"),
              cancelTooltip: t("cancel"),
              saveTooltip: t("save"),
            },
          },
          toolbar: {
            searchPlaceholder: t("search"),
            exportTitle: t("export"),
          },
          header: {
            actions: t("actions"),
          },
          pagination: {
            labelDisplayedRows: "{from}-{to} " + t("of") + " {count}",
            firstTooltip: t("first_page_tooltip"),
            previousTooltip: t("previous_page_tooltip"),
            nextTooltip: t("next_page_tooltip"),
            lastTooltip: t("last_page_tooltip"),
          },
        }}
        editable={{
          onRowDelete: (oldData) =>
            settings.AllowCriticalEditsAdmin
              ? new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    dispatch(deleteUser(oldData.id));
                    dispatch(fetchUsersOnce());
                  }, 600);
                })
              : new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    alert(t("demo_mode"));
                  }, 600);
                }),
        }}
        actions={[
          {
            icon: "add",
            tooltip: t("add_customer"),
            isFreeAction: true,
            onClick: (event) => navigate("/users/edituser/customer"),
          },
          (rowData) => ({
        tooltip: t("edit"),
          icon: () => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                marginRight:0
              }}
            >
              <EditIcon />  
            </div>
          ),
          onClick: (event, rowData) =>{
            navigate(`/users/edituser/customer/${rowData.id}`)
          }
        }),
          {
            icon: "info",
            tooltip: t("profile_page_subtitle"),
            onClick: (event, rowData) => {
              navigate(`/users/customerdetails/${rowData.id}`);
              
            },
          },
          
          (rowData) => ({
            icon: () => (
              <div style={{display:"flex", alignItems:"center" , flexWrap :"wrap", padding:10, backgroundColor:MAIN_COLOR, borderRadius:5, }}>
              
                <Typography style={{color:colors.LandingPage_Background}}>
                {t("documents")}
                </Typography>
                </div>
            ),
            tooltip:t('documents'),
            onClick:()=>navigate(`/users/userdocuments/${id}/${rowData.id}`)
          }),
        ]}
      />
    </ThemeProvider>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
}
