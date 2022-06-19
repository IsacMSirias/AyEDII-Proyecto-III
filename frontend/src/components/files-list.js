import React, { useRef, useState, useEffect, useContext } from "react";
import UsersDataService from '../services/users';
import { UserContext } from '../UserContext';
import { saveAs } from "file-saver";

import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
 
const FilesList = props => {
    
    const algorithms = [
        {label: 'Huffman', value: 'Huffman'},
        {label: 'LZW', value: 'LZW'},
        {label: 'LZ77', value: 'LZ77'},
        {label: 'LZ78', value: 'LZ78'}
    ];
    
    const { id, setId } = useContext(UserContext);
    const { setLoggedIn } = useContext(UserContext);
    const [algorithm, setAlgorithm] = useState('')
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [tag, setTag] = useState('')
    const [fileUploadDialog, setFileUploadDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [tagDialog, setTagDialog] = useState(false);
    const fileUploadRef = useRef(null);
    const toast = useRef(null);

    const chooseOptions = {icon: 'pi pi-fw pi-plus', className: 'custom-choose-btn p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', className: 'custom-upload-btn p-button-success p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', className: 'custom-cancel-btn p-button-danger p-button-outlined'};

    useEffect(() => {
        UsersDataService.getDocuments(id).then((res) => setFiles(res.data.documents));
    })

    function logout() {
        setId('');
        setLoggedIn(false);
    }

    const openFileUpload = () => {
        setFileUploadDialog(true);
    }

    const openTagDialog = () => {
        setTagDialog(true);
    }

    const confirmDeleteSelected = () => {
        setDeleteDialog(true);
    }

    const hideDialog = () => {
        setFileUploadDialog(false);
    }

    const hideTagDialog = () => {
        setTagDialog(false);
    }

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    }

    function deleteDocuments() {
        for (const i in selectedFiles) {
            UsersDataService.deleteDocument(selectedFiles[i]._id);
        }
        hideDeleteDialog()
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Upload" icon="pi pi-upload" className="p-button-sm p-button-success mr-2 p-button-outlined" onClick={openFileUpload}/>
                <Button label="Download" icon="pi pi-download" className="p-button-sm p-button-secondary mr-2 p-button-outlined" disabled={!selectedFiles || !selectedFiles.length} onClick={saveFile} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger mr-2 p-button-outlined" disabled={!selectedFiles || !selectedFiles.length} onClick={confirmDeleteSelected} />
                <Button label="Add tags" icon="pi pi-tags" className="p-button-sm p-button-warning mr-2 p-button-outlined" disabled={!selectedFiles || !selectedFiles.length} onClick={openTagDialog} />
            </React.Fragment>
        )
    }
    
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Sign out" icon="pi pi-sign-out" className="p-button-sm p-button-danger" onClick={logout} />
            </React.Fragment>
        )
    }

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDocuments}/>
        </React.Fragment>
    );

    const addTagFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideTagDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={addTag}/>
        </React.Fragment>
    );

    const onTemplateRemove = (callback) => {
        callback();
    }

    const itemTemplate = (file, props) => {
        return (
            <div>
                <div className="flex align-items-center flex-wrap">
                    <div className="flex align-items-center" style={{width: '40%'}}>
                        <span className="flex flex-column text-left ml-3">
                            {file.name}
                            <small>{new Date().toLocaleDateString()}</small>
                        </span>
                    </div>
                    <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                    <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-danger ml-auto" onClick={() => onTemplateRemove(props.onRemove)} />
                </div>
                <div className="flex justify-content-center mt-3">
                    <Dropdown value={algorithm} options={algorithms} onChange={(e) => setAlgorithm(e.value)} placeholder="Select a compression algorithm" />
                </div>
            </div>
        )
    }
    
    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-folder-open mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop a File Here</span>
            </div>
        )
    }

    async function addTag() {
        selectedFiles[0].tags.push(tag);
        UsersDataService.updateDocument({
            document_id:selectedFiles[0]._id,
            file: selectedFiles[0].file,
            tags: selectedFiles[0].tags
        })
        hideTagDialog();
    }

    const tagsBodyTemplate = (rowData) => {
        var indents = [];
        for (const i in rowData.tags) {
            indents.push(<Tag className="mr-2" severity="warning" value={rowData.tags[i]} />)
        }
        return indents
    }

    const customBase64Uploader = async ({ files }) => {
        // convert file to base64 encoded 
        const [file] = files;
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = function () {
            const base64data = reader.result;
            console.log(base64data);
            UsersDataService.createDocument({
                user_id: id,
                name: file.name,
                file: base64data.split(',')[1],
                tags: [file.size.toString()+' bytes', algorithm]
            })
            toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
            hideDialog();
        }
    }

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    const saveFile = async () => {
        const blob = b64toBlob(selectedFiles[0].file, 'text/html');
        saveAs(blob, selectedFiles[0].name)
    }
    
    const header = (
    <div className="flex justify-content-between align-items-center">
        <h1 className="m-0">Files</h1>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Tag Search" />
        </span>
    </div>
    );

    return (
        <div>
            <Toast ref={toast} />

            <div className="pt-2 pb-2 pl-2 pr-2">
                <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} ></Toolbar>

                <DataTable
                    value={files} header={header} responsiveLayout='scroll' selection={selectedFiles}
                    onSelectionChange={e => setSelectedFiles(e.value)} dataKey="_id"
                >
                    <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                    <Column field="name" header="Name"></Column>
                    <Column header="Tags" body={tagsBodyTemplate}></Column>
                    <Column field="date" header="Date" dataType="date"></Column>
                </DataTable>
            </div>

            <Dialog visible={fileUploadDialog} style={{ width: '700px' }} header="Upload file" modal className="p-fluid" onHide={hideDialog}>
            <FileUpload name="demo" ref={fileUploadRef} customUpload uploadHandler={customBase64Uploader} 
                    itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
            </Dialog>

            <Dialog visible={deleteDialog} style={{ width: '500px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    <span>Are you sure you want to delete the selected file/s?</span>
                </div>
            </Dialog>

            <Dialog visible={tagDialog} style={{ width: '450px' }} header="Add tag" modal footer={addTagFooter} onHide={hideTagDialog}>
                <div className="flex justify-content-center">
                    <span className="p-input-icon-right">
                        <i className="pi pi-tag" />
                        <InputText value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Write a tag" />
                    </span>
                </div>
            </Dialog>
        </div>
    );

}

export default FilesList;