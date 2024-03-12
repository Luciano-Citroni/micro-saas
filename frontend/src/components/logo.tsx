import { RocketIcon } from '@radix-ui/react-icons';

export function Logo() {
    return (
        <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-md">
            <RocketIcon className="w-5 h-5 text-primary-foreground" />
        </div>
    );
}
