import Grid from "@mui/material/Grid2";
import DocumentCard from "./DocumentCard";
import DocumentCardSkeleton from "./DocumentCardSkeleton";
import type { DocumentSummaryResponse } from "../../../api/types/document";

interface DocumentGridProps {
    documents: DocumentSummaryResponse[];
    isLoading: boolean;
    onOpen: (id: string) => void;
    onRename: (doc: DocumentSummaryResponse) => void;
    onDelete: (doc: DocumentSummaryResponse) => void;
}

const DocumentGrid = ({
                          documents,
                          isLoading,
                          onOpen,
                          onRename,
                          onDelete,
                      }: DocumentGridProps) => {
    // Show 8 skeletons while loading for a nice placeholder grid
    if (isLoading) {
        return (
            <Grid container spacing={2.5}>
                {Array.from({ length: 8 }).map((_, idx) => (
                    <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <DocumentCardSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={2.5}>
            {documents.map((doc, idx) => (
                <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <DocumentCard
                        document={doc}
                        onOpen={() => onOpen(doc.id)}
                        onRename={() => onRename(doc)}
                        onDelete={() => onDelete(doc)}
                        animationDelay={idx * 40}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default DocumentGrid;