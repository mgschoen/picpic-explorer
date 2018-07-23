<template>
<div>
    <b-row>
        <b-col>
            <h1>Select an article</h1>
        </b-col>
    </b-row>
    <b-row>
        <b-col>
            <b-form-input v-model="searchTerm" 
                type="text" 
                placeholder="Search..."></b-form-input>
        </b-col>
    </b-row>
    <b-row id="searchFilters">
        <b-col>
            <b-form-checkbox 
                v-model="onlyGettyMeta"
                :disabled="disableGettyFilter"
                @change="gettyCheckboxChanged">
                    Only articles with lead image from Getty
            </b-form-checkbox>
        </b-col>
    </b-row>
    <b-row>
        <b-col>
            <b-table striped :items="searchResults" :fields="tableFields">
                <template slot="headline" slot-scope="data">
                    <a :href="'#/article/' + data.item.id">{{data.value}}</a>
                </template>
            </b-table>
        </b-col>
    </b-row>
</div>
</template>

<script>
export default {
    name: 'list',
    data () {
        return {
            searchTerm: '',
            searchResults: [],
            searchTermTimeout: null,
            tableFields: {
                id: {
                    label: 'ID'
                },
                headline: {
                    label: 'Headline'
                },
                published: {
                    label: 'Published'
                }
            },
            onlyGettyMeta: false
        }
    },
    watch: {
        searchTerm: function (term) {
            if (this.searchTermTimeout) {
                window.clearTimeout(this.searchTermTimeout)
                this.searchTermTimeout = window.setTimeout(function () {
                    window.clearTimeout(this.searchTermTimeout)
                    if (term === '') {
                        this.getAllArticles(0)
                    } else {
                        this.searchForArticles(term, 0)
                    }
                }.bind(this), 500)
            } else {
                this.searchTermTimeout = window.setTimeout(function () {
                    window.clearTimeout(this.searchTermTimeout)
                    this.searchForArticles(term, 0)
                }, 500)
            }
        }
    },
    computed: {
        disableGettyFilter: function () {
            return this.searchTerm !== ''
        }
    },
    mounted () {
        this.getAllArticles(0)
    },
    methods: {
        gettyCheckboxChanged: function (checked) {
            this.getAllArticles(0, checked)
        },
        getAllArticles: function (page, onlyGettyLead) {
            let url = onlyGettyLead
                ? 'http://localhost:27112/articles/gettylead/'
                : 'http://localhost:27112/articles/'
            url += page
            console.log(`Requesting url ${url}`)
            this.$http.get(url).then(response => {
                this.searchResults = response.body.result.map(doc => {
                    let date = new Date(doc.published)
                    return {
                        id: doc.$loki,
                        headline: doc.article.headline,
                        published: date.toLocaleString('en-GB', {timeZone: 'UTC'})
                    }
                })
            }).catch(error => {})
        },
        searchForArticles: function (searchTerm, page) {
            this.$http.get('http://localhost:27112/search/' + encodeURI(searchTerm) + '/' + page).then(response => {
                this.searchResults = response.body.result.map(doc => {
                    let date = new Date(doc.published)
                    return {
                        id: doc.$loki,
                        headline: doc.article.headline,
                        published: date.toLocaleString('en-GB', {timeZone: 'UTC'})
                    }
                })
            }).catch(error => {})
        }
    }
}
</script>

<style>
#searchFilters {
    margin: 20px auto;
}
</style>