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
  data() {
    return {

      }
    }
};
</script>
<style></style>
