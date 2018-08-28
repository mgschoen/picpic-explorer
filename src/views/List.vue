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
    <b-row align-h="center" class="pagination-controls">
        <b-col cols="auto">
            <b-button-group>
                <b-button variant="outline-secondary" 
                    :disabled="!previous" @click="firstPage()"><< First</b-button>
                <b-button variant="outline-secondary" 
                    :disabled="!previous" @click="previousPage()">< Previous</b-button>
                <b-button variant="outline-secondary" 
                    disabled>Page {{page + 1}} / {{pagesTotal}}</b-button>
                <b-button variant="outline-secondary" 
                    :disabled="!next" @click="nextPage()">Next ></b-button>
                <b-button variant="outline-secondary" 
                    :disabled="!next" @click="lastPage()">Last >></b-button>
            </b-button-group>
        </b-col>
    </b-row>
</div>
</template>

<script>
let apiRoot = `${API_ROOT}`

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
            onlyGettyMeta: false,

            // pagination
            previous: false,
            next: false,
            page: 0,
            pagesTotal: 0
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
        updateList: function (apiResponse) {
            let pagination = apiResponse.body.pagination
            this.previous = pagination.previous
            this.next = pagination.next
            this.page = pagination.pageIndex
            this.pagesTotal = pagination.pagesTotal
            this.searchResults = apiResponse.body.result.map(doc => {
                let date = new Date(doc.published)
                return {
                    id: doc.id,
                    headline: doc.article.headline,
                    published: date.toLocaleString('en-GB', {timeZone: 'UTC'})
                }
            })
        },
        getAllArticles: function (page, onlyGettyLead) {
            let url = onlyGettyLead
                ? apiRoot + '/articles/gettylead/'
                : apiRoot + '/articles/'
            url += page
            this.$http.get(url).then(response => {
                this.updateList(response)
            }).catch(error => {})
        },
        searchForArticles: function (searchTerm, page) {
            this.$http.get(apiRoot + '/search/' + encodeURI(searchTerm) + '/' + page).then(response => {
                this.updateList(response)
            }).catch(error => {})
        },
        goToPage: function (page) {
            if (this.searchTerm === '') {
                this.getAllArticles(page, this.onlyGettyMeta)
            } else {
                this.searchForArticles(this.searchTerm, page)
            }
        },
        nextPage: function () {
            this.goToPage(this.page + 1)
        },
        previousPage: function () {
            this.goToPage(this.page - 1)
        },
        lastPage: function () {
            this.goToPage(this.pagesTotal - 1)
        },
        firstPage: function () {
            this.goToPage(0)
        }
    }
}
</script>

<style>
#searchFilters {
    margin: 20px auto;
}
.pagination-controls {
    margin-bottom: 20px;
}
</style>