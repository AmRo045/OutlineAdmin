import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function LoginPage() {
    return (
        <form className="flex flex-col items-center justify-center gap-2 min-h-[64vh]">
            <Input
                className="w-[264px]"
                color="primary"
                label="Password"
                placeholder="Enter your password"
                required={true}
                type="password"
                variant="underlined"
            />

            <Button className="w-[264px]" size="sm" type="submit">
                Login
            </Button>
        </form>
    );
}
