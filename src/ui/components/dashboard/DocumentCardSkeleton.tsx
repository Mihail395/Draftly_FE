import { Card, CardContent, Skeleton, Box } from "@mui/material";

const DocumentCardSkeleton = () => {
    return (
        <Card
            sx={{
                height: 220,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    p: 2.5,
                }}
            >
                {/* Icon placeholder */}
                <Skeleton
                    variant="rounded"
                    width={36}
                    height={36}
                    sx={{ mb: 2 }}
                />

                {/* Title placeholder */}
                <Skeleton variant="text" width="80%" sx={{ fontSize: "1.1rem" }} />
                <Skeleton variant="text" width="50%" sx={{ fontSize: "0.875rem", mb: 1 }} />

                {/* Spacer */}
                <Box sx={{ flex: 1 }} />

                {/* Bottom row — badge + date */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Skeleton variant="rounded" width={60} height={22} />
                    <Skeleton variant="text" width={80} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default DocumentCardSkeleton;