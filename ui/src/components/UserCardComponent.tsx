import type { WithParamActionButtonProps } from "./ActionButton";
import ActionButton from "./ActionButton";

export type UserCardData = {
    id: number;
    dp: string;
    name: string;
    email: string;
    phone: string;
    actionButtons: WithParamActionButtonProps[];
};
type UserCardProps = {
    card: UserCardData;
};

export default function UserCardComponent({ card }: UserCardProps) {
    return (
        <div className="text-center">
            <div className="flex flex-col gap-3 p-3 bg-gray-200/50 dark:bg-gray-800/70 rounded border border-slate-200/90 dark:border-slate-600 hover:drop-shadow-xs dark:hover:drop-shadow-gray-700/20">
                <ul className="text-center flex flex-col gap-1">
                    <li>
                        <img
                            src={card.dp}
                            alt="Customer Avatar"
                            width="100px"
                            className="mx-auto my-2 bg-gray-50 rounded-full outline-1 outline-gray-300 outline-offset-2"
                        />
                    </li>
                    <li className="flex flex-col text-center">{card.name}</li>
                    <li className="text-sm">{card.email}</li>
                    <li>{card.phone}</li>
                </ul>
                <div
                    className="inline-flex mx-auto my-1 rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500"
                    role="group"
                >
                    {card.actionButtons &&
                        card.actionButtons.map((btn, idx) => {
                            const isFirst = idx === 0;
                            const isLast =
                                idx === card.actionButtons!.length - 1;
                            const roundedClass =
                                isFirst && isLast
                                    ? "rounded-lg"
                                    : isFirst
                                      ? "rounded-s-lg"
                                      : isLast
                                        ? "rounded-e-lg"
                                        : "";

                            return (
                                <ActionButton
                                    key={idx}
                                    type="button"
                                    onClick={() => btn.onClick(card.id)}
                                    icon={btn.icon}
                                    className={`px-4 py-2 text-sm font-medium text-indigo-900 dark:text-white bg-indigo-200/80 hover:bg-indigo-400/80 dark:bg-indigo-600/40 dark:border-indigo-300/50 dark:hover:bg-indigo-900/50 focus:z-10 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors 
                                        ${roundedClass}`}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
