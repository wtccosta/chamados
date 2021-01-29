<template>
  <div>
    <b-button v-b-toggle.sidebar-right>Toggle Sidebar</b-button>
    <b-sidebar id="sidebar-right" title="Sidebar" right shadow>
      <div class="px-3 py-2">
            <b-nav vertical v-if="logged">
            <b-nav-item to="/tickets" exact exact-active-class="active"
      >Chamados Abertos</b-nav-item
    >
    <b-nav-item>Link</b-nav-item>
    <b-nav-item>Another Link</b-nav-item>
    <b-nav-item disabled>Disabled</b-nav-item>
  </b-nav>
      </div>
    </b-sidebar>
  </div>
</template>