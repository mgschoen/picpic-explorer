<template>
    <div>
        <b-row>
            <b-col lg="8" order="1" order-lg="0" id="articleContent">
                <h1>{{headline}}</h1>
                <div id="paragraphs">
                    <p v-for="p in paragraphs" :class="'para ' + p.type">
                        {{p.content}}
                    </p>
                </div>
            </b-col>
            <b-col lg="4" order="0" order-lg="1">
                <b-card :title="`Article $${id}`" id="articleMeta">
                    <p>
                        <b-button size="sm" :href="url" target="_blank">
                            Original article
                        </b-button>
                    </p>
                    <p>
                        <b>Published:</b> {{published}}<br />
                        <b>Section:</b> {{section}}
                    </p>

                    <div class="meta-block">
                        <h5>Teaser</h5>
                        <p><b>Headline:</b> {{teaserHeadline}}</p>
                    </div>

                    <div v-if="leadImage">
                        <div class="meta-block">
                            <h5>Lead Image</h5>
                            <p><b>Title:</b> {{leadImageTitle}}</p>
                            <a :href="leadImageUrl" target="_blank">
                                <img :src="leadImageUrl" class="image-lead">
                            </a>
                            <p><b>Caption:</b> {{leadImageCaption}}</p>
                            <p>
                                <b>Keywords:</b>
                                <span class="keyword" v-for="kw in leadImageKeywords">
                                    <code>{{kw.text}}</code>&#32;
                                </span>
                            </p>
                        </div>
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
        <b-row v-if="leadImage" class="matchings-row">
            <b-col>
                <term-list :terms="matchedTerms"></term-list>
            </b-col>
        </b-row>

        <b-row v-if="leadImage" class="matchings-row">
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
            matchingDataLoaded: false
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
                // trigger additional requests for term matching
                this.loadMatching()
            }
        }).catch(error => {})
    },
    methods: {
        loadMatching: function () {
            this.$http.get(apiRoot + '/article/' + this.id + '/match').then(response => {
                this.matchedTerms = response.body.matchedTerms
                this.termStatistics = response.body.stats
                this.matchingDataLoaded = true
            }).catch(error => {})
        }
    },
    components: { TermList, TermStats, TermPlot }
}
</script>

<style lang="scss">
#articleMeta {
    margin-bottom: 30px;
}
.meta-block {
    border-top: 1px solid rgba(0, 0, 0, .125);
    padding-top: 10px;

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
</style>