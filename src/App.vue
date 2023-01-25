<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import debounce from "lodash/debounce";

import MarkdownDoc from "./components/MarkdownDoc.vue";
import { provideEditor } from "./composables/editor"

// editor

const sample = `
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

- item 1
- item 2
- item 3
`

const editor = provideEditor()

const text = ref(sample.trim())

const loading = ref(false)

function setTokens(){
  editor.tokens = editor.md.markdownToTokens(text.value)  
}

watch(text, () => {  
  setTokens()

  if (loading.value) return
})

onMounted(setTokens)

function onUpdateTokens() {
  loading.value = true

  text.value = editor.getMarkdown()

  loading.value = false
}

const onUpdateText  = debounce(() => {
  editor.emit('update:text', {})
})

editor.on('update:tokens', onUpdateTokens)


</script>
<template>
   <v-app>
    <v-app-bar title="Markdown editor" color="primary" :elevation="0" ></v-app-bar>   

    <v-main>

      <div class="tw-h-full tw-w-full tw-flex ">
        <textarea
          v-model="text"
          @update:model-value="onUpdateText"
          label="Markdown"   
          class="tw-w-6/12 tw-h-full tw-p-4 tw-bg-slate-100 tw-outline-none"
        />

        <div class="tw-w-6/12 tw-h-full tw-p-4  tw-outline-none tw-relative">
          <markdown-doc v-if="editor.tokens.length" />          
        </div>

      </div>


    </v-main>
  </v-app>
</template>