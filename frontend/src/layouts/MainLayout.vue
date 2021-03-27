<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
        v-if="drawer"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="q-ml-lg">
          {{title}}
        </q-toolbar-title>
        <q-btn
          flat
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="drawer"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>

        <q-item
          clickable
          v-for="link in essentialLinks"
          :key="link.title"
          tag="a"
          :to="link.link"
        >

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const linksList = [
  {
    title: 'Presentation',
    link: '/admin/presentation'
  },
  {
    title: 'Slides',
    link: '/admin/slides'
  },
  {
    title: 'Displays',
    link: '/admin/displays'
  }
];

const logout = () => {
  console.log(`${window.location.protocol}//logout@${window.location.host}`)
  window.location.href = `${window.location.protocol}//logout@${window.location.host}`;
}

const getTitle = (route) => () => {
  const auth = route.meta.auth || {};
  return auth.isAdmin ? 'Admin' : (auth.display || {}).name || '';
}

export default defineComponent({
  name: 'MainLayout',
  props: ['drawer'],
  setup (props) {
    const leftDrawerOpen = ref(false)
    const route = useRoute();
    const title = computed(getTitle(route));

    return {
      title,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout
    }
  }
})
</script>
