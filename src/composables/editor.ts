import { reactive, provide, ref, inject } from 'vue'
import type { InjectionKey } from 'vue'
import { createMarkdownLib, IToken } from '../markdown';

export const key: InjectionKey<ReturnType<typeof createState>> = Symbol('Editor')

const md = createMarkdownLib();

interface Observer {
    event: string;
    callback: (payload: any) => void;
}

function createState(){

    const tokens = ref<IToken[]>([])
    const observers: Observer[] = []

    function getHtml(){
        return md.tokensToHtml(tokens.value)
    }

    function getMarkdown(){
        return md.tokensToMarkdown(tokens.value)
    }

    function  getTokenById(id: string){
        return tokens.value.find(token => token.id === id)
    }

    function updateTokenById(id: string, payload: Partial<IToken>){
        const index = tokens.value.findIndex(token => token.id === id)
        const token = tokens.value[index]

        if(index !== -1){
            tokens.value.splice(index, 1, {
                ...token,
                ...payload,
                id,
            })

            emit('update:tokens', tokens.value)
        }
    }

    function on(event: string, callback: (payload: any) => void){
        observers.push({
            event,
            callback
        })
    }

    function emit(event: string, payload: any){
        console.log('emit', event, payload)
        
        observers.forEach(observer => {
            if(observer.event === event){
                observer.callback(payload)
            }
        })
    }

    return reactive({
        md: md,
        tokens,
        getHtml,
        getMarkdown,
        getTokenById,
        updateTokenById,
        on,
        emit
    })
}

export function provideEditor(){
    const state = createState()

    provide(key, state)

    return state
}

export function useEditor(){
    return inject(key, createState())
}