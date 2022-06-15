import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
 
const FilesList = props => {

    const algorithms = [
        {label: 'Huffman', value: 'Huffman'},
        {label: 'LZW', value: 'LZW'},
        {label: 'LZ77', value: 'LZ77'},
        {label: 'LZ78', value: 'LZ78'}
    ];

    const [algorithm, setAlgorithm] = useState('')
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [fileUploadDialog, setFileUploadDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const chooseOptions = {icon: 'pi pi-fw pi-plus', className: 'custom-choose-btn p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', className: 'custom-upload-btn p-button-success p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', className: 'custom-cancel-btn p-button-danger p-button-outlined'};

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/restaurants').then((res) => setFiles(res.data.restaurants));
    })

    const onUpload = () => {
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const openFileUpload = () => {
        setFileUploadDialog(true);
    }

    const confirmDeleteSelected = () => {
        setDeleteDialog(true);
    }

    const hideDialog = () => {
        setFileUploadDialog(false);
    }

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Upload" icon="pi pi-upload" className="p-button-success mr-2" onClick={openFileUpload}/>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger mr-2 p-button-outlined" disabled={!selectedFiles || !selectedFiles.length} onClick={confirmDeleteSelected} />
                <Button label="Download" icon="pi pi-download" className="p-button-secondary mr-2" />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Sign out" icon="pi pi-sign-out" className="p-button-danger" />
            </React.Fragment>
        )
    }

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" />
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
                        <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
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
                <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Image Here</span>
            </div>
        )
    }
    
    const header = (
        <div className="table-header text-2xl font-norma">
            Files
        </div>
    );

    return (
        <div>
            <Toast ref={toast}></Toast>

            <div className="pt-2 pb-2 pl-2 pr-2">
                <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} ></Toolbar>

                <DataTable
                    value={files} header={header} responsiveLayout='scroll' selection={selectedFiles}
                    onSelectionChange={e => setSelectedFiles(e.value)} dataKey="restaurant_id" stripedRows
                >
                    <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                    <Column field="restaurant_id" header="Id"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="cuisine" header="Cuisine"></Column>
                    <Column field="borough" header="Borough"></Column>
                </DataTable>
            </div>

            <Dialog visible={fileUploadDialog} style={{ width: '700px' }} header="Upload file" modal className="p-fluid" onHide={hideDialog}>
            <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php"
                    onUpload={onUpload} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
            </Dialog>

            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    <span>Are you sure you want to delete the selected file/s?</span>
                </div>
            </Dialog>
        </div>
    );

}

export default FilesList;