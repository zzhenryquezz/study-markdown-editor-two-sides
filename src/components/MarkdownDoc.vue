
<script setup lang="ts">
import {  watch } from "vue";

import { useEditor } from '../composables/editor'

import VHeading from "./VHeading.vue";

const editor = useEditor()

const doc = {
    components: {
        VHeading
    },
    template: editor.md.tokensToHtml(editor.tokens)
}

// watch(() => editor.tokens, () => {
//     if (doc.template) return

//     doc.template = editor.md.tokensToHtml(editor.tokens)
// })

</script>
<template>
    <component v-if="doc.template" :is="doc" />
</template>