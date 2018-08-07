<template>
    <b-card title="Term statistics">
        <div v-if="loaded">
            <p>
                <b>Terms total:</b> {{stats.termsTotal}}<br />
                <b>Keyword matching rate:</b>
                <b-progress 
                    :value="stats.matchesTotal"
                    :max="stats.keywordsTotal"
                    variant="secondary"></b-progress>
                {{`${stats.matchesTotal}/${stats.keywordsTotal} keywords matched (${stats.matchPercentage} %)`}}
            </p>

            <h5>Term frequency</h5>
            <p>
                <b>max:</b> {{stats.termFrequency.max}}<br />
                <b>mean:</b> {{Math.round(stats.termFrequency.mean * 100) / 100}}<br />
                <b>median:</b> {{stats.termFrequency.median}}<br />
                <b>std:</b> {{Math.round(stats.termFrequency.std * 100) / 100}}
            </p>

            <h5>First occurrence</h5>
            <p>
                <b>mean:</b> {{`${Math.round(stats.firstOccurrence.mean * 100) / 100} %`}}
                <b-progress :value="stats.firstOccurrence.mean" :max="1" variant="dark"></b-progress>
                <b>median:</b> {{`${Math.round(stats.firstOccurrence.median * 100) / 100} %`}}
                <b-progress :value="stats.firstOccurrence.median" :max="1" variant="dark"></b-progress>
                <b>std:</b> {{Math.round(stats.firstOccurrence.std * 100) / 100}}
            </p>

            <h5>Part-of-speech</h5>
            <p>
                <b>mean:</b>
                <b-badge variant="info">{{`nouns: ${Math.round(stats.pos.nouns.mean * 100) / 100}`}}</b-badge>
                <b-badge variant="success">{{`verbs: ${Math.round(stats.pos.verbs.mean * 100) / 100}`}}</b-badge>
                <b-badge variant="warning">{{`adjs: ${Math.round(stats.pos.adjs.mean * 100) / 100}`}}</b-badge>
                <b-badge variant="danger">{{`advs: ${Math.round(stats.pos.advs.mean * 100) / 100}`}}</b-badge>
                <b-badge variant="secondary">{{`rest: ${Math.round(stats.pos.rest.mean * 100) / 100}`}}</b-badge><br />
            </p>
            <p>
                <b>median:</b>
                <b-badge variant="info">{{`nouns: ${stats.pos.nouns.median}`}}</b-badge>
                <b-badge variant="success">{{`verbs: ${stats.pos.verbs.median}`}}</b-badge>
                <b-badge variant="warning">{{`adjs: ${stats.pos.adjs.median}`}}</b-badge>
                <b-badge variant="danger">{{`advs: ${stats.pos.advs.median}`}}</b-badge>
                <b-badge variant="secondary">{{`rest: ${stats.pos.rest.median}`}}</b-badge><br />
            </p>
            <p>
                <b>std:</b>
                <b-badge variant="info">{{`nouns: ${Math.round(stats.pos.nouns.std * 100) / 100}`}}</b-badge>
                <b-badge variant="success">{{`verbs: ${Math.round(stats.pos.verbs.std * 100) / 100}`}}</b-badge>
                <b-badge variant="warning">{{`adjs: ${Math.round(stats.pos.adjs.std * 100) / 100}`}}</b-badge>
                <b-badge variant="danger">{{`advs: ${Math.round(stats.pos.advs.std * 100) / 100}`}}</b-badge>
                <b-badge variant="secondary">{{`rest: ${Math.round(stats.pos.rest.std * 100) / 100}`}}</b-badge><br />
            </p>
        </div>
        <div v-if="!loaded">
            <p>Loading statistics...</p>
        </div>
    </b-card>
</template>

<script>
export default {
    name: 'term-stats',
    props: ['stats', 'loaded'],
    data() {
        return {}
    }
}
</script>

<style scoped lang="scss">

</style>