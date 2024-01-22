<script setup>
import {userLogged} from "~/composables/userLogged.js";

  userLogged()
</script>

<template>
  <UCard>
    <template #header>
      Singing in ...
    </template>

    Please wait ... while we are signing you in!
  </UCard>
</template>

