<template>
    <b-card :header="title" footer-tag="footer">
        <div class="controls">
            <b-row>
                <b-col md="6">
                    <label for="threshold">Threshold: {{threshold}}</label>
                    <b-form-input 
                        id="threshold"
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        v-model="threshold"
                        v-on:change="thresholdChanged"
                        size="sm"
                        :disabled="status === 'loading' || entitiesOnly"></b-form-input>
                </b-col>
                <b-col md="6">
                    <label for="sortOrder">Sort order:</label>
                    <b-form-select 
                        id="sortOrder"
                        v-model="sortOrder" 
                        :options="sortOrderOptions"
                        size="sm"
                        v-on:change="sortOrderChanged"
                        :disabled="status === 'loading'"></b-form-select>
                        </b-col>
            </b-row>
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

            <a :href="detailUrl" 
                target="_blank" 
                v-if="status === 'ready'" class="imageLink"
                :style="'background-image: url(' + previewUrl + ');'">
            </a>

            <div v-if="status === 'ready' || status === 'no-image'" class="resultDetails">
                <p><b>Query:</b> {{query}}</p>
                <p>
                    <b-collapse :id="'collapseSearchTerms-'+_uid">
                        <b>Terms:</b>
                        <span v-for="term in searchTerms">
                            <code v-b-tooltip.hover 
                                :title="Math.round(term.p * 1000) / 1000">
                                {{term.originalTerms[0]}}</code>&#32;
                        </span>
                    </b-collapse>
                    <a role="button" tabindex="0" 
                        v-b-toggle="'collapseSearchTerms-'+_uid" 
                        id="collapseSearchTermsToggle"></a>
                </p>
            </div>
        </div>

        <div slot="footer" v-if="mode === 'ml'">
            <label for="entitiesOnly">Use entity terms only:</label>
            <switches id="entitiesOnly" 
                v-model="entitiesOnly"
                v-on:input="entitiesOnlyChanged">
                sdf
            </switches>
        </div>
    </b-card>
</template>

<script>
import Switches from 'vue-switches'

let apiRoot = `${API_ROOT}`

export default {
    name: 'image-selector',
    props: [ 'title', 'mode', 'id', 'defaultThreshold' ],
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
            entitiesOnly: false,

            status: 'not-mounted'
        }
    },
    computed: {
        requestBaseURL: function () {
            let modeString = this.mode + (this.entitiesOnly ? '-entities' : '') 
            return `${apiRoot}/article/${this.id}/picpic/${modeString}`
        }
    },
    mounted() {
        this.status = 'mounted'
        this.threshold = this.defaultThreshold
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
            if (this.status !== 'loading') {
                this.status = 'loading'
                this.resetResults()
                let url = `${this.requestBaseURL}/${threshold}/${sortOrder}`
                this.$http.get(url).then(response => {
                    this.query = response.body.queryString
                    this.searchTerms = response.body.queryTerms
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
            }
        },
        thresholdChanged: function (newThreshold) {
            if (this.status !== 'not-mounted') {
                this.pickPic(newThreshold, this.sortOrder)
            }
        },
        sortOrderChanged: function (newSortOrder) {
            if (this.status !== 'not-mounted') {
                this.pickPic(this.threshold, newSortOrder)
            }
        },
        entitiesOnlyChanged: function () {
            if (this.status !== 'not-mounted') {
                this.pickPic(this.threshold, this.sortOrder)
            }
        }
    },
    components: {
        Switches
    }
}
</script>

<style scoped lang="scss">
.card-header {
    font-weight: 600;
    text-align: center;
}
.card-body {
    font-size: 0.85rem;
}
.result {
    margin-top: 20px;

    .imageLink {
        background-size: cover;
        background-position: center;
        display: block;
        margin-bottom: 10px;
        height: 200px;
        width: 100%;
    }

    code {
        border: 1px solid rgba(0, 0, 0, .125);
        border-radius: 2px;
        padding: 0 3px;
        white-space: nowrap;
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
#entitiesOnly {
    left: 5px;
    top: 3px;
}
</style>