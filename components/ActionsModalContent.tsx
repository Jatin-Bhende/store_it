import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { ShareInputProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

const ShareInput = ({ file, onInputChange, onRemove }: ShareInputProps) => {
	return (
		<>
			<ImageThumbnail file={file} />

			<div className="share-wrapper">
				<p className="subtitle-2 pl-1 text-light-100">
					Share file with other users
				</p>
				<Input
					type="email"
					placeholder="Enter email"
					onChange={(e) => onInputChange(e.target.value.trim().split(","))}
					className="share-input-field"
				/>
				<div className="pt-4">
					<div className="flex justify-between">
						<p className="subtitle-2 text-light-100">Shared with</p>
						<p className="subtitle-2 text-light-200">
							{file.users.length} user(s)
						</p>
					</div>

					<ul className="pt-2">
						{file.users.map((email: string) => (
							<li
								key={email}
								className="flex items-center justify-between gap-2"
							>
								<p className="subtitle-2">{email}</p>
								<Button
									onClick={() => onRemove(email)}
									className="share-remove-user"
								>
									<Image
										src="/assets/icons/remove.svg"
										alt="remove"
										width={24}
										height={24}
										className="remove-icon"
									/>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export { FileDetails, ShareInput };
