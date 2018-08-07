<template>
    <b-card title="Matched terms">
        <b-table small striped responsive :fields="fields" :items="terms">
            <template slot="stemmedText" slot-scope="data">
                <code>{{data.value}}</code>
            </template>
            <template slot="originalTerms" slot-scope="data">
                <b-badge v-for="term in data.value" :key="term" variant="dark" class="term">
                    {{term}}
                </b-badge>
            </template>
            <template slot="originalTermsKW" slot-scope="data">
                <b-badge v-for="term in data.value" :key="term" variant="secondary" class="term">
                    {{term}}
                </b-badge>
            </template>
            <template slot="firstOccurrence" slot-scope="data">
                <b-progress 
                    :value="data.value" 
                    :max="1"
                    variant="dark"
                    v-b-tooltip.hover
                    :title="`${Math.round(data.value * 10000) / 100} % of article`">
                </b-progress>
            </template>
            <template slot="containingElements" slot-scope="data">
                <b-badge v-for="elem in data.value" :key="elem" variant="light" class="term">
                    {{elem}}
                </b-badge>
            </template>
            <template slot="pos" slot-scope="data">
                <b-badge variant="info" class="term" v-if="data.value.nouns.length">
                    {{`nouns: ${data.value.nouns.length}`}}
                </b-badge>
                <b-badge variant="success" class="term" v-if="data.value.verbs.length">
                    {{`verbs: ${data.value.verbs.length}`}}
                </b-badge>
                <b-badge variant="warning" class="term" v-if="data.value.adjectives.length">
                    {{`adj: ${data.value.adjectives.length}`}}
                </b-badge>
                <b-badge variant="danger" class="term" v-if="data.value.adverbs.length">
                    {{`adv: ${data.value.adverbs.length}`}}
                </b-badge>
                <b-badge variant="secondary" class="term" v-if="data.value.rest.length">
                    {{`rest: ${data.value.rest.length}`}}
                </b-badge>
            </template>
        </b-table>
    </b-card>
</template>

<script>
export default {
    name: 'term-list',
    props: ['terms'],
    data() {
        return {
            fields: [
                { key: 'stemmedText', label: 'term (stemmed)' },
                { key: 'originalTerms', label: 'terms (article)' },
                { key: 'originalTermsKW', label: 'terms (keyword)' },
                { key: 'termFrequency', label: 'term frequency', sortable: true },
                { key: 'firstOccurrence', label: 'first occurrence', sortable: true },
                { key: 'containingElements', label: 'paragraph types' },
                { key: 'pos', label: 'POS' },
                { key: 'keywordType', label: 'keyword type' }
            ]
        }
    }
}
</script>

<style scoped lang="scss">
.term {
    font-weight: 200;
    margin: 0 2px;
}
</style>