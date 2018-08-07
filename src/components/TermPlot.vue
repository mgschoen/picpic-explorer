<template>
    <b-card title="Terms plotted">
        <vue-plotly 
            :data="plotData" 
            :layout="plotLayout" 
            :options="plotlyOptions"></vue-plotly>
    </b-card>
</template>

<script>
import VuePlotly from '@statnett/vue-plotly'

let apiRoot = `${API_ROOT}`

export default {
    name: 'term-plot',
    props: ['articleId'],
    data() {
        return {
            keywordTerms: [],
            nonKeywordTerms: [],

            plotLayout: {
                margin: {
                    t: 0, r: 0, b: 0, l: 0
                },
                xaxis: {
                    title: 'first occurrence',
                    showticklabels: false
                },
                yaxis: {
                    title: 'term frequency',
                    showticklabels: false
                },
                dragmode: 'pan',
                hovermode: 'closest'
            },
            plotlyOptions: {
                scrollZoom: true,
                displayModeBar: false
            }
        }
    },
    computed: {
        plotData: function () {
            let nonKeywordTrace = {
                x: [],
                y: [],
                text: [],
                name: 'regular terms',
                mode: 'markers',
                type: 'scatter'
            }
            let keywordTrace = {
                x: [],
                y: [],
                text: [],
                name: 'keywords',
                mode: 'markers+text',
                textposition: 'top center',
                type: 'scatter'
            }
            for (let term of this.nonKeywordTerms) {
                nonKeywordTrace.x.push(term.x)
                nonKeywordTrace.y.push(term.y)
                nonKeywordTrace.text.push(term.label)
            }
            for (let term of this.keywordTerms) {
                keywordTrace.x.push(term.x)
                keywordTrace.y.push(term.y)
                keywordTrace.text.push(term.label)
            }
            return [nonKeywordTrace, keywordTrace]
        }
    },
    mounted() {
        this.$http.get(apiRoot + '/article/' + this.articleId + '/plot/fo-tf').then(response => {
            this.keywordTerms = response.body.keywordTerms
            this.nonKeywordTerms = response.body.nonKeywordTerms
        })
    },
    components: { VuePlotly }
}
</script>