import {onMounted, onBeforeUnmount, ref} from "vue";

export default function useHideToTop() {

   const showToTop = ref(true)

   const handleToTop = () => {
     const width = window.innerWidth
     showToTop.value = width > 959
   }

   onMounted(()=>{
       window.addEventListener('resize',handleToTop)
   })
   onBeforeUnmount(()=>{
        window.removeEventListener('resize',handleToTop)
    })

    return {
       showToTop
    }
}
