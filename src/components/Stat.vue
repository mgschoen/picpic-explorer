<template>
    <div>
        <img :src="imgurl">
        <h4>{{title}}</h4>
        <code>{{value}}</code>
    </div>
</template>

<script>

export default {
    name: 'stat',
    props: {
        title: '',
        value: '',
        image: ''
    },
    data() {
        return {}
    },
    computed: {
        imgurl: function () {
            if (this.image) {
                return require('../assets/' + this.image)
            }
            return ''
        }
    }
}

</script>

<style lang="scss" scoped>
    h4 {
        font-size: .7rem;
        font-weight: 500;
        margin-bottom: 0;
    }
    code {
        color: rgb(33, 37, 41);
    }
    img {
        margin-bottom: 5px;
        width: auto;
        max-height: 25px;
    }
</style>