<input type="checkbox" id="drawer-toggle" name="drawer-toggle" />
<label for="drawer-toggle" id="drawer-toggle-label">Open Drawer2</label>
<nav id="drawer">
  <ul>
    <li><a href="#">Menu Item</a></li>
    <li><a href="#">Menu Item</a></li>
    <li><a href="#">Menu Item</a></li>
    <li><a href="#">Menu Item</a></li>
  </ul>
</nav>

<style>
  #drawer-toggle {
    position: absolute;
    opacity: 0;
  }

  #drawer-toggle-label {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    left: 0px;
    height: 50px;
    width: 50px;
    display: block;
    position: fixed;
    background: rgba(255, 255, 255, 0);
    z-index: 1;
  }

  /* adds our "hamburger" menu icon */

  #drawer-toggle-label:before {
    content: '';
    display: block;
    position: absolute;
    height: 2px;
    width: 24px;
    background: #8d8d8d;
    left: 13px;
    top: 18px;
    box-shadow:
      0 6px 0 #8d8d8d,
      0 12px 0 #8d8d8d;
  }

  header {
    width: 100%;
    position: fixed;
    left: 0px;
    background: #efefef;
    padding: 10px 10px 10px 50px;
    font-size: 30px;
    line-height: 30px;
    z-index: 0;
  }

  /* drawer menu pane - note the 0px width */

  #drawer {
    position: fixed;
    top: 0;
    left: -300px;
    height: 100%;
    width: 300px;
    background: #2f2f2f;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 20px;
    -webkit-overflow-scrolling: touch;
  }

  /* actual page content pane */

  #page-content {
    margin-left: 0px;
    margin-top: 50px;
    width: 100%;
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding: 20px;
  }

  /* checked styles (menu open state) */

  #drawer-toggle:checked ~ #drawer-toggle-label {
    height: 100%;
    width: calc(100% - 300px);
    background: rgba(255, 255, 255, 0.8);
  }

  #drawer-toggle:checked ~ #drawer-toggle-label,
  #drawer-toggle:checked ~ header {
    left: 300px;
  }

  #drawer-toggle:checked ~ #drawer {
    left: 0px;
  }

  #drawer-toggle:checked ~ #page-content {
    margin-left: 300px;
  }

  /* Menu item styles */

  #drawer ul {
    list-style-type: none;
  }

  #drawer ul a {
    display: block;
    padding: 10px;
    color: #c7c7c7;
    text-decoration: none;
  }

  #drawer ul a:hover {
    color: white;
  }

  /* Responsive MQ */

  @media all and (max-width: 350px) {
    #drawer-toggle:checked ~ #drawer-toggle-label {
      height: 100%;
      width: 50px;
    }

    #drawer-toggle:checked ~ #drawer-toggle-label,
    #drawer-toggle:checked ~ header {
      left: calc(100% - 50px);
    }

    #drawer-toggle:checked ~ #drawer {
      width: calc(100% - 50px);
      padding: 20px;
    }

    #drawer-toggle:checked ~ #page-content {
      margin-left: calc(100% - 50px);
    }
  }
</style>
