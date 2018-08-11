<template>
    <b-card title="Autoselect image (stat)">
        <div class="controls">
            <label for="threshold">Threshold: {{threshold}}</label>
            <b-form-input 
                id="threshold"
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                v-model="threshold"
                v-on:change="thresholdChanged"
                size="sm"
                :disabled="status === 'loading'"></b-form-input>
            
            <label for="sortOrder">Sort order:</label>
            <b-form-select 
                id="sortOrder"
                v-model="sortOrder" 
                :options="sortOrderOptions"
                size="sm"
                v-on:change="sortOrderChanged"
                :disabled="status === 'loading'"></b-form-select>
        </div>

        <div class="result">
            <!-- Loading -->
            <b-progress v-if="status === 'loading'" :max="1" height="20px" animated>
                <b-progress-bar :value="1" label="Loading..."></b-progress-bar>
            </b-progress>
            <!-- Error -->
            <b-alert variant="danger" :show="status === 'error'">
                Ooops. An error occurred.
            </b-alert>
            <!-- No image -->
            <b-alert variant="info" :show="status === 'no-image'">
                This query did not return any results. Try different parameters.
            </b-alert>

            <a :href="detailUrl" target="_blank" v-if="status === 'ready'">
                <img :src="previewUrl">
            </a>

            <div v-if="status === 'ready' || status === 'no-image'" class="resultDetails">
                <p><b>Query:</b> {{query}}</p>
                <p>
                    <b-collapse id="collapseSearchTerms">
                        <b>Terms:</b>
                        <span v-for="term in searchTerms">
                            <code>{{term}}</code>&#32;
                        </span>
                    </b-collapse>
                    <a role="button" tabindex="0" 
                        v-b-toggle.collapseSearchTerms 
                        id="collapseSearchTermsToggle"></a>
                </p>
            </div>
        </div>
    </b-card>
</template>

<script>
let apiRoot = `${API_ROOT}`

export default {
    name: 'image-selector-stat',
    props: [ 'id' ],
    data() {
        return {
            query: '',
            searchTerms: [],
            previewUrl: '',
            detailUrl: '',

            threshold: 0.5,
            sortOrder: 'most_popular',
            sortOrderOptions: [ 
                { value: 'most_popular', text: 'most popular' },
                { value: 'best_match', text: 'best match' },
                { value: 'newest', text: 'newest' }
            ],

            status: 'loading'
        }
    },
    mounted() {
        this.pickPic(this.threshold, this.sortOrder)
    },
    methods: {
        resetResults: function () {
            this.query = ''
            this.searchTerms = []
            this.previewUrl = ''
            this.detailUrl = ''
        },
        pickPic: function (threshold, sortOrder) {
            this.status = 'loading'
            this.resetResults()
            let url = `${apiRoot}/article/${this.id}/picpic/stat/${threshold}/${sortOrder}`
            this.$http.get(url).then(response => {
                this.query = response.body.queryString
                this.searchTerms = response.body.queryTerms.map(term => term.stemmedTerm)
                let image = response.body.image
                if (image) {
                    this.previewUrl = image.previewUrl
                    this.detailUrl = image.detailUrl
                    this.status = 'ready'
                } else {
                    this.status = 'no-image'
                }
            }).catch(error => {
                this.status = 'error'
            })
        },
        thresholdChanged: function (newThreshold) {
            this.pickPic(newThreshold, this.sortOrder)
        },
        sortOrderChanged: function (newSortOrder) {
            this.pickPic(this.threshold, newSortOrder)
        }
    }
}
</script>

<style scoped lang="scss">
.result {
    margin-top: 20px;

    img {
        margin-bottom: 10px;
        width: 100%;
    }

    &Details p {
        margin: 0 auto 5px;
    }
    #collapseSearchTermsToggle {

        &:hover {
            cursor: pointer;
        }

        &.collapsed:after {
            content: '+ Show terms';
        }

        &:not(.collapsed):after {
            content: '- Hide terms'
        }
    }
}
</style>