<template>
<div>
  <user-card></user-card>
  </div>
</template>
<script>
import UserCard from '../../components/UserProfile/UserCard.vue';
export default {
    middleware:'authtenticated',
  components: { UserCard },
  head: {
    title: 'IvcarIoT - Mi Cuenta',
  },
  data() {
    return {

      }
    }
};
</script>
<style></style>
