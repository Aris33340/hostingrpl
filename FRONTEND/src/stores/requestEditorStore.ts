import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import PdfEditRequestDto, { EditablePage, type UserRoleKeys } from '../types/pdfEditor';
export const usePdfEditRequestStore = defineStore('pdfEditor', {
    state: (): PdfEditRequestDto => ({
        userId:0,
        userRole:'PETUGAS',
        configuration:{
            editOption:'iterateInside',
            pdfFileName:'nons',
            pdfId:0,
            projectName:'test',
            renderOption:{saveToDb:true},
            tableReference:'mahasiswa',
        },
        editablePages:[],
    }),
    actions: {
        init(){
            const authStore = useAuthStore();
            this.userId = Number(authStore.getPayload().sub);
            this.userRole = authStore.getPayload().role as UserRoleKeys;
            this.configuration.editOption = authStore.getPayload().role as UserRoleKeys === 'BUKUWISUDA' ? 'iterateInside' : 'iterateOutside'
        },
        setConfig(projectName:string, asZip:boolean, saveToDb:boolean,pdfFileName?:string){
            this.configuration.pdfFileName = pdfFileName ?? ''
            this.configuration.projectName = projectName
            this.configuration.renderOption.asZip = asZip
            this.configuration.renderOption.saveToDb = saveToDb
        },
        setEditablePages(editablePages:EditablePage[]){
            this.editablePages = editablePages;
        },
        setPdfId(pdfId:number){
            this.configuration.pdfId = Number(pdfId)
        },
        getState(){
            return this.$state
        }
        
    }
});
