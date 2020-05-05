import FinderApp from 'nyc-lib/nyc/ol/FinderApp'

FinderApp.SCREEN_READER_INFO = `<h1 style="color:red">Important</h1>
<p style="color:red">
  The following instructions are meant for people with disabilities who use assistive technology.
  For all other inquiries please contact <a style="color:red" href="tel:311">311</a>.<br>
</p>
<p style="text-align:center">
  <a class="btn rad-all btn-ok" href="javascript:$('.screen-reader-info .btn.rad-all.btn-ok').click()" style="display: inline-block;">
    Return to the map
  </a>
</p>
<h1 tabindex="0" aria-live="polite">Screen reader Instructions for NYC Finder Apps</h1>
<h2>Getting started</h2>
<p>
  This finder app uses the NYC DoITT nyc-lib javascript library which templates mapping
  applications and provides accessibility functionality. Below are general screen reader
  instructions on how to use all of the finder apps that use this template.
  When the application first loads, there is a dialogue box with an introduction to each
  specific finder app. Users can navigate to the continue or view map link and press
  enter to proceed to the finder app. There is a "Reload" button that is always near
  the top of the page that takes users back to this initial dialogue.
</p>
<h2>Search for an address</h2>
<p>
  Users can enter an address to get a list of nearby locations. When the finder app loads,
  screen reader and keyboard focus is dropped into a search field. Input an address then
  press enter to submit.
</p>
<p>
  If the address was entered correctly, the list of locations will
  update, screen readers will announce the number of results and shift focus to the
  beginning of the search results.
</p>
<p>
  If there are address suggestions, focus will shift to the first suggestion. Press tab
  to cycle through suggestions and enter to select an address. Screen readers will announce
  the number of results and focus will shift to the beginning of the results area.
</p>
<h2>Navigating results</h2>
<p>
  Screen reader users can navigate by headings to browse through each result. For JAWS and
  NVDA, press the "H" key. For Voiceover users, press Command, Option, Control and "H" or
  just "H" with Quicknav and single letter navigation turned on.
</p>
<p>
  Screen reader users can also use regions to navigate to different areas such as the banner,
  search form, and list of results. Jaws users can press the "R" key. NVDA users can press
  the "D" key. Voiceover users can pull up a list of regions if it is included in their web
  rotor settings.
</p>
<h2>Translate and share</h2>
<p>
  Below the search field are options to translate or share this page. JAWS and NVDA users
  can use the tab key to navigate to them. Screen reader users can also navigate to them
  using regions. JAWS users can press the “R” key to navigate to the translate or share
  regions. NVDA users can use the “D” key to navigate to those regions. Voiceover users can
  pull up a list of regions if it is included in their web rotor settings.
</p>
<p>
  To translate, navigate to the translate combobox. JAWS and NVDA users can press enter to
  open the combobox and the arrow keys to navigate through the options. Voiceover users
  can open the combobox by pressing control, option and space bar then the arrow keys to
  navigate through the options. All users can then press enter or return to make a selection.
</p>
<p>
  To share this page, navigate to the share button or region. JAWS and NVDA users can press
  enter on the “Share” toggle button to expand the share options. Voiceover users can press
  control, option and space bar. All users can then use tab or the arrow keys to navigate
  through the different share options and press enter or return to make a selection. 
</p>
<h2>Travel directions</h2>
<p>
  When browsing through each result, users can press enter on the "Directions" button in
  order to get travel directions. 
</p>
<p>
  The screen that follows has Google maps directions for transit, walking, driving and ride
  services. There is also an option for MTA Trip Planner which can give wheelchair accessible
  directions. Please note that if a user chooses MTA Trip Planner, they will be taken to an
  external website.
</p>
<h2>Accessibility Feedback</h2>
<p>
  If you have questions or feedback regarding the accessibility of this map,
  <a href="https://www1.nyc.gov/nyc-resources/contact-the-citys-digital-accessibility-coordinator.page">
  contact the Digital Accessibility Coordinator</a> at the Mayor’s Office for People with Disabilities.
</p>`