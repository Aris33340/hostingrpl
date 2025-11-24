import { defineStore } from 'pinia';
import type { PdfEditRequestDto, EditablePage, ElementProperty, Size, ElementType, TextStyle, Position } from '../types/pdfEditor';
import { useAuthStore } from './authStore';
export const usePdfEditRequestStore = defineStore('pdfEditor', {
    state: (): PdfEditRequestDto => ({
        userDetail:{
            id:0,
            role:''
        },
        configuration:{
            pdfId: 0,
            pdfFileName: '',
            editOption: 'renderinsidepage',
            renderOption: { saveToDb: true, insertMode: true }
        },
        editablePages: [{
            pageNumber:1,
            elements:[]
        }],
    }),

    getters: {
        getPage: (state) => (pageNum: number): EditablePage | undefined => {
            return state.editablePages.find(p => p.pageNumber === pageNum);
        }
    },

    actions: {
        init(){
            const authStore = useAuthStore();
            this.userDetail.id = Number(authStore.getPayload().sub)
            this.userDetail.role = authStore.getPayload().role
        },
        setPdfId(pdfId:number){
            this.configuration.pdfId = pdfId;
        },
        showDto(){
            return this.$state;
        },
        addPage(page: EditablePage) {
            const index = this.editablePages.findIndex(e => e.pageNumber === page.pageNumber)
            if(index !== -1){
                this.editablePages[index]?.elements.push(...page.elements)
                return
            }
            this.editablePages.push(page);
        },
        setDto(dto: PdfEditRequestDto) {
            this.$state = dto;
        },
        editElement(pageNumber: number, elementEdit: ElementProperty) {
            const page = this.editablePages.find(p => p.pageNumber === pageNumber);
            if (!page) return;
            const index = page.elements.findIndex(e => e.id === elementEdit.id)
            if(index !== -1){
                page.elements[index] = elementEdit;
            }
        },
        addOneElement(pageNum:number,element:ElementProperty){
            const page = this.$state.editablePages.find((p) => p.pageNumber===pageNum)
            page?.elements?.push(element);
        },
        addManyElement(pageNum:number,element:ElementProperty[]){
            const page = this.$state.editablePages.find((p) => p.pageNumber===pageNum)
            page?.elements?.push(...element);
        },
        createElement(id:number,position: Position, size: Size, type: ElementType, rotation?: number, content?: string, fieldName?: string, fileId?: number, Textstyle?: TextStyle, opacity?: number): ElementProperty {
            const element: ElementProperty = {
                id: id,
                position: position,
                size: size,
                type: type,
                content: content ?? '',
                rotation: rotation ?? 0,
                fieldName: fieldName ?? null,
                fileId: fileId ?? null,
                Textstyle: Textstyle ?? {
                    fontSize: 11,
                    fontFamily: 'Arial',
                    bold: false,
                    italic: false,
                    underline: false,
                    color: { r: 0, g: 0, b: 0 }
                },
                opacity: opacity ?? 1
            }
            return element
        }
    }
});
