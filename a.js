<script>
const teamElements = document.querySelectorAll('.filter-by-teams h3');
const teamNames = Array.from(teamElements).map(element => element.textContent.trim());
document.querySelector(".filter-menu").innerHTML= teamNames.map(item=> <li id="tab-show-all" class="tab active has-icon" role="presentation"><a href="#tab_show-all" role="tab" aria-selected="true" aria-controls="tab_show-all"><span>Show All</span></a></li>).join("")
</script>