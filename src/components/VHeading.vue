<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

import { useEditor } from "../composables/editor";

const props = defineProps({
    tokenId: {
        type: String,
        required: true
    },
})

const editor = useEditor()

const token = computed(() => {
    return editor.getTokenById(props.tokenId)
})

const level = computed(() => {
    return String(token.value?.config?.level || '1')
})

const icons: Record<string, string> = {
    '1': 'mdi-format-header-1',
    '2': 'mdi-format-header-2',
    '3': 'mdi-format-header-3',
    '4': 'mdi-format-header-4',
    '5': 'mdi-format-header-5',
    '6': 'mdi-format-header-6',
}

const levels: Record<string, string> = {
    '1': 'h1',
    '2': 'h2',
    '3': 'h3',
    '4': 'h4',
    '5': 'h5',
    '6': 'h6',
}

const sizes: Record<string, string> = {
    '1': 'tw-text-4xl',
    '2': 'tw-text-3xl',
    '3': 'tw-text-2xl',
    '4': 'tw-text-xl',
    '5': 'tw-text-lg',
    '6': 'tw-text-base',
}

// update content

const content = ref('')


function setContent() {
    content.value = token.value?.config?.content || ''
}

editor.on('update:text', setContent)

onMounted(setContent)

function onInput(e: InputEvent) {
    const el = e.target as HTMLElement

    editor.updateTokenById(props.tokenId, {
        config: {
            level: level.value,
            content: el.innerText,
        }
    })
}

function updateLevel(level: string) {

    editor.updateTokenById(props.tokenId, {
        config: {
            level,
            content: token.value?.config?.content,
        }
    })
}

function onEnter(){
    console.log('enter')
}

const isFocused = ref(false)

</script>
<template>
    <div class="tw-flex tw-items-center" :class="[sizes[level]]"  >
        <v-menu>
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    size="small"
                    color="grey"
                    class="tw-mr-2"
                    :class="[isFocused ? 'tw-opacity-100' : 'tw-opacity-0']"
                    tabindex="-1"

                >
                    <v-icon :icon="icons[level]"  />
                </v-btn>            
            </template>

            <v-list  density="compact">
                <v-list-item
                    v-for="(item, index) in 6"
                    :key="index"
                    :value="item"
                    :active="String(item) === level"
                    variant="plain"
                    active-color="primary"
                    @click="updateLevel(String(item))"

                >
                    
                    <v-icon :icon="icons[item]"  />                    
                </v-list-item>
            </v-list>
        </v-menu>

        <component
            class="tw-outline-none tw-font-bold"
            :is="levels[level]"
            contenteditable
            @input="onInput"
            @keydown.prevent.enter="onEnter"
            @focus="isFocused = true"
            @blur="isFocused = false"
        >
            {{ content  }}
        </component>
    </div>
</template>