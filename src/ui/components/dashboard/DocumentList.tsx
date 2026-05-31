import { Box, Skeleton } from "@mui/material";
import DocumentListRow from "./DocumentListRow";
import type { DocumentSummaryResponse } from "../../../api/types/document";

interface DocumentListProps {
    documents: DocumentSummaryResponse[];
    isLoading: boolean;
    onOpen: (id: string) => void;
    onRename: (doc: DocumentSummaryResponse) => void;
    onDelete: (doc: DocumentSummaryResponse) => void;
}

const DocumentList = ({
                          documents,
                          isLoading,
                          onOpen,
                          onRename,
                          onDelete,
                      }: DocumentListProps) => {
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                        }}
                    >
                        <Skeleton variant="rounded" width={36} height={36} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="text" width="20%" sx={{ fontSize: "0.75rem" }} />
                        </Box>
                        <Skeleton variant="rounded" width={60} height={22} />
                        <Skeleton variant="text" width={70} />
                        <Skeleton variant="circular" width={28} height={28} />
                    </Box>
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {documents.map((doc, idx) => (
                <DocumentListRow
                    key={doc.id}
                    document={doc}
                    onOpen={() => onOpen(doc.id)}
                    onRename={() => onRename(doc)}
                    onDelete={() => onDelete(doc)}
                    animationDelay={idx * 25}
                />
            ))}
        </Box>
    );
};

export default DocumentList;