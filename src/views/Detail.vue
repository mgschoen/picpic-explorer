<template>
    <div>
        <b-row>
            <b-col cols="12">
                <h1>{{headline}}</h1>
                <p class="articleMeta">
                    <b-badge variant="light">{{published}}</b-badge>
                    <span class="separator">|</span>
                    <b-badge variant="light">{{section}}</b-badge>
                </p>
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="4" sm="6">
                <!-- Image selector statistics-based -->
                <image-selector 
                    mode="stat"
                    :id="id"
                    title="Autoselect image (stat)"
                    default-threshold="0.5">
                </image-selector>
            </b-col>

            <b-col lg="4" sm="6">
                <!-- Image selector machine learning based -->
                <image-selector 
                    mode="ml"
                    :id="id"
                    title="Autoselect image (ML)"
                    default-threshold="0.1">
                </image-selector>
            </b-col>

            <b-col lg="4" sm="6" v-if="leadImage">
                <!-- Original lead image -->
                <b-card header="Original lead image" v-if="leadImage">
                    <div class="meta-block">
                        <p><b>Title:</b> {{leadImageTitle}}</p>
                        <a :href="leadImageUrl" target="_blank">
                            <img :src="leadImageUrl" class="image-lead">
                        </a>
                        <b-collapse id="collapseKeywords">
                            <p><b>Caption:</b> {{leadImageCaption}}</p>
                            <p>
                                <b>Keywords:</b>
                                <span class="keyword" v-for="kw in leadImageKeywords">
                                    <code>{{kw.text}}</code>&#32;
                                </span>
                            </p>
                        </b-collapse>
                        <a role="button" tabindex="0" 
                            v-b-toggle.collapseKeywords 
                            id="collapseKeywordsToggle"></a>
                    </div>
                </b-card>
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="8" order="1" order-lg="0" id="articleContent">
                <div id="paragraphs">
                    <p v-for="p in paragraphs" :class="'para ' + p.type">
                        {{p.content}}
                    </p>
                </div>
            </b-col>
            <b-col lg="4" order="0" order-lg="1">
                <!-- Article details -->
                <b-card title="Article details" id="articleDetails">
                    <div class="meta-block">
                        <p>
                            <b-button size="sm" :href="url" target="_blank">
                                Original article
                            </b-button>
                        </p>
                        <p>
                            <b>ID:</b> <code>{{id}}</code><br />
                            <b>Teaser headline:</b> {{teaserHeadline}}
                        </p>
                    </div>

                    <div class="meta-block">
                        <h5>Article images</h5>
                        <p>
                            <a v-for="img in images" :href="img.src" target="_blank" class="image-thumb">
                                <img :src="img.src">
                            </a>
                        </p>
                    </div>
                </b-card>
            </b-col>
        </b-row>

        <!-- Additional stats if lead image exist -->
        <b-row v-if="leadImage && !showStats" class="matchings-row">
            <b-col style="text-align: center;">
                <b-button @click="loadStats" v-if="!statsLoading">
                    <span v-if="statsLoading !== true">Show statistics</span>
                </b-button>
                <b-progress v-if="statsLoading" 
                    :max="1" 
                    height="20px" 
                    variant="secondary"
                    animated>
                        <b-progress-bar :value="1" label="Loading stats..."></b-progress-bar>
                </b-progress>
            </b-col>
        </b-row>
        <b-row v-if="showStats" class="matchings-row">
            <b-col> 
                <term-list :terms="matchedTerms"></term-list>
            </b-col>
        </b-row>

        <b-row v-if="showStats" class="matchings-row">
            <b-col lg="4">
                <term-stats 
                    :stats="termStatistics"
                    :loaded="matchingDataLoaded">
                </term-stats>
            </b-col>
            <b-col lg="8">
                <term-plot :article-id="id"></term-plot>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Mark from 'mark.js'

import TermList from '../components/TermList.vue'
import TermStats from '../components/TermStats.vue'
import TermPlot from '../components/TermPlot.vue'
import ImageSelector from '../components/ImageSelector.vue'

let apiRoot = `${API_ROOT}`

export default {
    name: 'detail',
    props: ['id'],
    data () {
        return {
            // article content
            headline: '',
            paragraphs: [],
            images: [],

            // article meta
            published: '',
            section: '',
            url: '',
            teaserHeadline: '',

            // leadImage
            leadImage: false,
            leadImageTitle: '',
            leadImageUrl: '',
            leadImageCaption: '',
            leadImageKeywords: [],

            // marker
            marker: null,

            // matching data
            matchedTerms: [],
            termStatistics: {},
            matchingDataLoaded: false,

            // view params
            statsLoading: false,
            showStats: false
        }
    },
    mounted () {
        this.$http.get(apiRoot + '/article/' + this.id).then(response => {
            let doc = response.body
            this.url = 'http://www.bbc.com' + doc.url
            this.headline = doc.article.headline
            this.paragraphs = doc.article.paragraphs
            this.images = doc.article.images
            this.teaserHeadline = doc.teaser.headline
            this.published = new Date(doc.published).toLocaleString('en-GB', {timeZone: 'UTC'})
            this.section = doc.section
            if (doc.leadImage) {
                this.leadImage = true
                this.leadImageTitle = doc.leadImage.title
                this.leadImageUrl = doc.leadImage.url
                this.leadImageCaption = doc.leadImage.caption
                this.leadImageKeywords = doc.leadImage.keywords
                // mark all keywords in text
                this.$nextTick().then(() => {
                    this.marker = new Mark(this.$el.querySelector('#articleContent'))
                    let keywords = this.leadImageKeywords.map(kw => {
                        return kw.text
                    })
                    this.marker.mark(keywords, {
                        acrossElements: true,
                        separateWordSearch: false
                    })
                })
            }
        }).catch(error => {})
    },
    methods: {
        loadMatching: function () {
            return new Promise((resolve, reject) => {
                this.$http.get(apiRoot + '/article/' + this.id + '/match').then(response => {
                    this.matchedTerms = response.body.matchedTerms
                    this.termStatistics = response.body.stats
                    this.matchingDataLoaded = true
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        loadStats: function () {
            this.statsLoading = true
            this.loadMatching().then(() => {
                this.showStats = true
                this.statsLoading = false
            })
        }
    },
    components: { TermList, TermStats, TermPlot, ImageSelector }
}
</script>

<style lang="scss">
.articleMeta {
    border-top: 1px solid rgba(0, 0, 0, .125);
    border-bottom: 1px solid rgba(0, 0, 0, .125);
    margin: 20px auto;
    padding-bottom: 5px;

    a {
        color: inherit;
    }

    span.separator {
        color: rgba(0, 0, 0, .125);
    }

    .badge {
        font-weight: 200;
        letter-spacing: .05em;
    }
}
.card {
    font-size: .85rem;
    margin-bottom: 30px;

    &-header {
        font-weight: 600;
        text-align: center;
    }
}
.meta-block {

    &:not(:first-of-type) {
        border-top: 1px solid rgba(0, 0, 0, .125);
        padding-top: 10px;
    }

    & .image- {

        &lead {
            margin-bottom: 16px;
            width: 100%;
        }

        &thumb {
            float: left;

            & img {
                height: 40px;
                max-width: 100px;
            }
        }
    }
}
span.keyword code {
    border: 1px solid rgba(0, 0, 0, .125);
    border-radius: 2px;
    padding: 0 3px;
    white-space: nowrap;
}
#paragraphs p {
    &.H2, &H3 {
        font-weight: bold;
        font-size: 24px;
    }
    &.LI {
        margin-left: 30px;

        &:before {
            content: '- ';
        }
    }
}
.matchings-row {
    margin-top: 20px;
}

#collapseKeywordsToggle {

    &:hover {
        cursor: pointer;
    }

    &.collapsed:after {
        content: '+ Show details';
    }

    &:not(.collapsed):after {
        content: '- Hide details'
    }
}
</style>