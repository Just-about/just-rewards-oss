import { MessagesMetadata, sendToBackground } from "@plasmohq/messaging";

type MessageName = keyof MessagesMetadata;

const returnOrThrow = <Res>(
  message: string | undefined,
  defaultResponse: Res | undefined,
  name: MessageName
): Res => {
  if (defaultResponse === undefined)
    throw new Error(message || `Failed to run background message \`${name}\``);
  return defaultResponse;
};

export const backgroundMessage = async <Req, Res>(
  name: MessageName,
  body: Req,
  defaultResponse: Res | undefined = undefined
): Promise<Res> => {
  try {
    const response = await sendToBackground<Req, MessageResponse<Res>>({
      name,
      body,
      extensionId: chrome.runtime.id,
    });

    if ("error" in response) {
      return returnOrThrow(response.error.message, defaultResponse, name);
    }

    return response.data;
  } catch (e: any) {
    return returnOrThrow(e.message, defaultResponse, name);
  }
};
