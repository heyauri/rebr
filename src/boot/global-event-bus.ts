import {TinyEmitter} from 'tiny-emitter';
var emitter = new TinyEmitter();

//@ts-ignore
export default ({app}) => {
    app.config.globalProperties.$global = {
        //@ts-ignore
        $on: (...args: any) => emitter.on(...args),
        //@ts-ignore
        $once: (...args: any) => emitter.once(...args),
        //@ts-ignore
        $off: (...args: any) => emitter.off(...args),
        //@ts-ignore
        $emit: (...args: any) => emitter.emit(...args)
    }
}
