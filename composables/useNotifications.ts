import { useToast } from "@/components/ui/toast/use-toast";

export const useNotifications = () => {
    const { toast } = useToast();

    const showError = ({ error, title, description }: {
        error?: unknown,
        title?: string,
        description?: string
    }) => {
        let errorMessage;

        if (error instanceof Error) {
            errorMessage = error.message
        }

        toast({
            title: title || "Something went wrong",
            description: errorMessage || description,
            variant: "destructive",
        });
    }


    const showSuccess = ({ title, description }: { title?: string, description?: string }) => {
        toast({
            title: title || "Success",
            description: description,
            variant: "default",
        });
    }

    return {
        showSuccess,
        showError
    }
}