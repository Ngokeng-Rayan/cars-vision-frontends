import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Une erreur est survenue</h3>
            <p className="text-muted-foreground mb-4">{message || 'Impossible de charger les données'}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline">
                    Réessayer
                </Button>
            )}
        </div>
    )
}
