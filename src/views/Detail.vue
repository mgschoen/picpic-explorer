<template>
    <div>
        <b-row>
            <h1>I am the detail view</h1>
        </b-row>
        <b-row>
            <p>For article ${{id}}</p>
        </b-row>
    </div>
</template>

<script>
export default {
  name: 'detail',
  props: ['id'],
  data () {
      return {}
  }
}
</script>

<style>

</style>