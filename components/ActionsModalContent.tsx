import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
	return (
		<div className="file-details-thumbnail">
			<Thumbnail type={file.type} extension={file.extension} url={file.url} />
			<div className="flex flex-col">
				<p className="subtitle-2 mb-1">{file.name}</p>
				<FormattedDateTime date={file.$createdAt} className="caption" />
			</div>
		</div>
	);
};

const DetailsRow = ({ label, value }: { label: string; value: string }) => {
	return (
		<div className="flex">
			<p className="file-details-label text-left">{label}</p>
			<p className="file-details-value text-left">{value}</p>
		</div>
	);
};

const FileDetails = ({ file }: { file: Models.Document }) => {
	return (
		<>
			<ImageThumbnail file={file} />
			<DetailsRow label="Format:" value={file.extension} />
			<DetailsRow label="Size:" value={convertFileSize(file.size)} />
			<DetailsRow label="Owner:" value={file.owner.fullName} />
			<DetailsRow label="Last Edit:" value={formatDateTime(file.$updatedAt)} />
		</>
	);
};

export { FileDetails };
