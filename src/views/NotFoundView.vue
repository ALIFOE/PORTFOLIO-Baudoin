<script setup>
import image404 from '@/assets/img/template/404.png'
</script>

<template>
  <section class="error-section fix section-padding">
    <div class="container">
      <div class="error-items">
        <div v-anim="'.3s'" class="thumb">
          <img :src="image404" alt="Erreur 404" />
        </div>
        <div class="content">
          <h2 v-split>Cette page s'est perdue en route.</h2>
          <div class="right-con">
            <p v-anim="'.4s'">
              Le lien que vous avez suivi est peut-être incorrect, ou la page a été déplacée. Pas d'inquiétude : tout le
              reste du portfolio est à portée de clic.
            </p>
            <router-link v-anim="'.6s'" to="/" class="theme-btn w-100">Retour à l'accueil</router-link>
            <p class="mt-3">
              Ou consultez directement <router-link to="/projets"><u>mes projets</u></router-link> et
              <router-link to="/contact"><u>la page contact</u></router-link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
