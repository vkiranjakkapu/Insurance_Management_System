// import { useCallback, useEffect, useRef, useState } from "react";
// import ActionButton from "./ActionButton";
// import {
//     CloudArrowUpIcon,
//     QuestionMarkCircleIcon,
// } from "@heroicons/react/24/outline";
// import DocumentsService, { DocumentType } from "../services/DocumentsService";

// export type DocumentUploadProps = {

// }

// export default function DocumentsComponent() {
//     const uploadFileRef = useRef<HTMLInputElement>(null);
//     const [allDocuments, setAllDocs] = useState<Document[]>([]);
//     const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
//     const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//     const [docUploadProgress, setDocUploadProgress] = useState(false);
//     const [showNewDoc, setShowNewDoc] = useState(false);
//     const [docRefreshProgress] = useState(false);

//     const refreshDocuments = useCallback(() => {
//         DocumentsService.getAllDocumentsByType<Document[]>(
//             DocumentType.POLICY_DOCUMENT,
//         ).then((resp) => {
//             if (resp && !("errorMessage" in resp)) {
//                 setAllDocs(resp);
//             } else {
//                 setAllDocs([]);
//                 console.log(resp);
//             }
//         });
//     }, []);

//     useEffect(() => {
//         refreshDocuments();
//     }, [refreshDocuments]);
//     const uploadFile = () => {
//         setDocUploadProgress(true);

//         if (!uploadedFile) {
//             console.error("No file selected!");
//             return;
//         }

//         // 1. Create the native FormData instance container
//         const payload = new FormData();

//         // 2. Append text key-value pairs matching backend fields
//         payload.append("fileName", String(uploadedFile.name));
//         payload.append("documentType", DocumentType.POLICY_DOCUMENT);

//         // 3. Append the raw file binary payload
//         payload.append("file", uploadedFile);

//         DocumentsService.uploadDocument<Document>(payload).then((resp) => {
//             if ("error" in resp) {
//                 setFormErrors(() => ({
//                     type: "error",
//                     errors: ["Error Uploading file"],
//                 }));
//             }
//             if ("errorMessage" in resp) {
//                 setFormErrors(() => ({
//                     type: "error",
//                     errors: [resp.errorMessage],
//                 }));
//             } else {
//                 setAllDocs((prev) => [resp, ...prev]);
//                 setUploadedFile(null);
//                 setShowNewDoc(true);
//             }
//             setDocUploadProgress(false);
//         });
//     };

//     return (
//         <>
//             <div className="md:row-span-2">
//                 <div className="relative shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
//                     <div className="sticky inline-flex gap-4 items-center justify-between h-2/6 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 capitalize bg-slate-100/60 dark:bg-slate-700/20 border-b border-b-slate-200 dark:border-slate-800 w-full">
//                         <span>Select Document</span>
//                         <span className="hidden md:block">(OR)</span>
//                         <ActionButton
//                             text="Upload"
//                             type="button"
//                             icon={CloudArrowUpIcon}
//                             onClick={() => {
//                                 uploadFileRef.current?.click();
//                             }}
//                             className="p-0.5 rounded-lg outline-1 outline-indigo-500 outline-offset-1"
//                         />
//                         <input
//                             type="file"
//                             ref={uploadFileRef}
//                             onChange={(event) => {
//                                 setUploadedFile(
//                                     event.target.files != null
//                                         ? event.target.files[0]
//                                         : null,
//                                 );
//                             }}
//                             name="upload"
//                             id="upload"
//                             className="hidden"
//                         />
//                     </div>
//                     <div className="h-32 overflow-scroll">
//                         {uploadedFile != null && (
//                             <div className="px-3 py-1.5 w-full flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200">
//                                 <label className="cursor-pointer py-1.5 select-none w-full inline-flex items-center gap-2">
//                                     {docUploadProgress && (
//                                         <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
//                                     )}
//                                     <p
//                                         className={`${docUploadProgress && "animate-pulse"}}`}
//                                     >
//                                         {docUploadProgress
//                                             ? "Uploading"
//                                             : "Selected"}{" "}
//                                         - {uploadedFile.name}
//                                     </p>
//                                     {!docUploadProgress && (
//                                         <ActionButton
//                                             type="button"
//                                             onClick={uploadFile}
//                                             text="Confirm"
//                                             icon={QuestionMarkCircleIcon}
//                                             className="rounded-full px-1.5 text-sm"
//                                             disabled={docUploadProgress}
//                                         />
//                                     )}
//                                 </label>
//                             </div>
//                         )}
//                         {allDocuments.length == 0 ? (
//                             <div className="p-3 w-full flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200">
//                                 {docRefreshProgress ? (
//                                     <span className="inline-flex gap-2 items-center">
//                                         <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
//                                         Fetching documents...
//                                     </span>
//                                 ) : (
//                                     <>
//                                         <span>
//                                             No Policy Documents Available
//                                         </span>
//                                         {/* <ActionButton
//                                                     text="Refresh"
//                                                     type="button"
//                                                     className="rounded-lg"
//                                                     icon={ArrowPathIcon}
//                                                     onClick={() => {
//                                                         setDocRefreshProgress(
//                                                             true,
//                                                         );
//                                                         refreshDocuments();
//                                                     }}
//                                                 /> */}
//                                     </>
//                                 )}
//                             </div>
//                         ) : (
//                             allDocuments.map((document, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="px-3 py-0.5 truncate w-full flex items-center border-b border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200"
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         name="document"
//                                         id={`file-${document.id}`}
//                                         value={document.id} // Stays numeric in your code, but comes out as a string in the event
//                                         className="me-2 cursor-pointer h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:bg-red-400"
//                                         // Bind change listener
//                                         onChange={handleDocumentCheckbox}
//                                         // Controlled checkbox: returns true if the number 1 is in our array
//                                         checked={selectedDocuments.includes(
//                                             document.id,
//                                         )}
//                                     />
//                                     <label
//                                         htmlFor={`file-${document.id}`}
//                                         className="cursor-pointer inline-flex justify-between py-1.5 select-none w-full truncate"
//                                     >
//                                         <span>{document.fileName}</span>
//                                         {showNewDoc && idx == 0 && (
//                                             <span className="capitalize inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
//                                                 <ExclamationCircleIcon className="size-3.5 text-emerald-500" />
//                                                 new
//                                             </span>
//                                         )}
//                                     </label>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
