<template>
  <base-dropdown
    tag="li"
    :menu-on-right="!$rtl.isRTL"
    title-tag="a"
    title-classes="nav-link"
    class="nav-item"
  >
    <template slot="title">
        <i class="tim-icons icon-world"></i>
      <b class="caret d-none d-lg-block d-xl-block"></b>
      <p class="d-lg-none">{{$t('dashboardnavbar.locales.title')}}</p>
    </template>

    <li class="nav-link">
      <div @click.stop="setLocale('es')">
        <img
          src="/img//flags/es.png"
          style="max-width: 50px; max-height: 50px;"
          alt=""
        />
        <span class="ml-2 mt-3">Castellano</span>
      </div>
    </li>
    <div class="dropdown-divider"></div>
    <li class="nav-link">
      <div @click.stop="setLocale('en')">
        <img
          src="/img//flags/en.png"
          style="max-width: 50px; max-height: 50px;"
          alt=""
        />
        <span class="ml-2">English</span>
      </div>
    </li>
  </base-dropdown>
</template>

<script>
export default {
  components: {
    
  },
  data() {
    return {
      locales: ["es", "en"]
    };
  },
  computed: {
    locale() {
      return this.$store.state.locale.locale;
    },
  },
  methods: {
    setLocale(locale) {
      const oldLocal = this.$store.state.locale.locale;
      console.log(oldLocal);
      this.$store.commit("locale/setLocale", locale);

      const actualPathSplitted = this.$route.path.split("/");

      if (oldLocal == "es" && locale !== "es") {
        // estoy en castellano y me pase otro idioma distinto
        const page = actualPathSplitted[2];
        this.$router.push(`/${locale}/app/${page}`);
        return;
      }
      if (locale == "es" && oldLocal != "es") {
        // esto en castellano y me paso a otro idioma distitno
        const page = actualPathSplitted[3];
        this.$router.push(`/app/${page}`);
        return;
      }
    }
  },
};
</script>
