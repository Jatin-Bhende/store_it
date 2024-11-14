/* eslint-disable no-unused-vars */

import React from "react";
import { Models } from "node-appwrite";

declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare type Extension =
	// Document
	| "pdf"
	| "doc"
	| "docx"
	| "txt"
	| "xls"
	| "xlsx"
	| "csv"
	| "rtf"
	| "ods"
	| "ppt"
	| "odp"
	| "md"
	| "html"
	| "htm"
	| "epub"
	| "pages"
	| "fig"
	| "psd"
	| "ai"
	| "indd"
	| "xd"
	| "sketch"
	| "afdesign"
	| "afphoto"
	| "afphoto"
	// Image
	| "jpg"
	| "jpeg"
	| "png"
	| "gif"
	| "bmp"
	| "svg"
	| "webp"
	// Video
	| "mp4"
	| "avi"
	| "mov"
	| "mkv"
	| "webm"
	// Audio
	| "mp3"
	| "wav"
	| "ogg"
	| "flac"
	// Other
	| (string & {});

declare interface ActionType {
	label: string;
	icon: string;
	value: string;
}

declare interface SearchParamProps {
	params?: Promise<SegmentParams>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
	file: File;
	ownerId: string;
	accountId: string;
	path: string;
}
declare interface GetFilesProps {
	types: FileType[];
	searchText?: string;
	sort?: string;
	limit?: number;
}
declare interface RenameFileProps {
	fileId: string;
	name: string;
	extension: Extension;
	path: string;
}
declare interface UpdateFileUsersProps {
	fileId: string;
	emails: string[];
	path: string;
}
declare interface DeleteFileProps {
	fileId: string;
	bucketFileId: string;
	path: string;
}

declare interface FileUploaderProps {
	ownerId: string;
	accountId: string;
	className?: string;
}

declare interface MobileNavigationProps {
	$id: string;
	accountId: string;
	fullName: string;
	avatar: string;
	email: string;
}
declare interface SidebarProps {
	fullName: string;
	avatar: string;
	email: string;
}

declare interface ThumbnailProps {
	type: string;
	extension: Extension;
	url: string;
	className?: string;
	imageClassName?: string;
}

declare interface ShareInputProps {
	file: Models.Document;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemove: (email: string) => void;
}
