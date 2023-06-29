import { Page } from "puppeteer";

export async function handleMutation(
  mutations: any,
  page: Page,
  chainOfMutations: any[]
) {
  const previousMutations = chainOfMutations.map((mut) => mut.type);
  for (const mutation of mutations) {
    chainOfMutations.push(mutation);
  }
  for (const mutation of chainOfMutations) {
    switch (mutation.type) {
      case "childList":
        const removedNodes: any = Object.values(mutation.removedNodes);
        for (const removedNode of removedNodes) {
          if (removedNode.length) {
            const element = mutation.target.id
              ? await page?.$(`#${mutation.target.id}`)
              : mutation.target.className
              ? await page?.$(`${mutation.target.className}`)
              : await page?.$(`${mutation.target.localName}`);

            if (removedNode.nodeName !== "#text") {
              if (element) {
                await page?.evaluate((el) => {
                  el.remove();
                }, element);
              }
            }
          }
        }
        const addedNodes: any = Object.values(mutation.addedNodes);
        for (const addedNode of addedNodes) {
          if (addedNode.nodeName === "#text") {
            const element = mutation.target?.id
              ? await page?.$(`#${mutation.target.id}`)
              : null;
            if (element) {
              await page?.evaluate(
                (el, addedNode) => {
                  //@ts-ignore
                  el.innerText = addedNode.wholeText;
                },
                element,
                addedNode
              );
            }
          } else if (addedNode.nodeName === "DIV") {
            const element = mutation.target.id
              ? await page?.$(`#${mutation.target.id}`)
              : await page?.$(`${mutation.target.localName}`);
            if (element) {
              await page?.evaluate(
                (el, addedNode) => {
                  const div = document.createElement(`${addedNode.localName}`);
                  div.className = addedNode.className;
                  div.id = addedNode.id;
                  div.innerText = addedNode.innerText;
                  el.appendChild(div);
                },
                element,
                addedNode
              );
            }
          }
        }

        break;
      case "attributes": {
        await handleAtributes(page, mutation);
        break;
      }
      case "characterData": {
        console.log("characterData");
        const element = mutation.target?.id
          ? await page?.$(`#${mutation.target.id}`)
          : null;
        if (element) {
          await page.evaluate(
            (element, newValue) => {
              element.nodeValue = newValue;
            },
            element,
            mutation.newValue
          );
        }
        break;
      }
      default:
        break;
    }
    if (
      mutation.type !== "attributes" &&
      previousMutations.includes("attributes")
    ) {
      const indexOfMutation = previousMutations.indexOf("attributes");
      const attributeMutaion = chainOfMutations[indexOfMutation];
      await handleAtributes(page, attributeMutaion);
    }
  }
}

const handleAtributes = async (page: Page, mutation: any) => {
  const element = mutation.target?.id
    ? await page?.$(`#${mutation.target.id}`)
    : null;
  if (element) {
    await page.evaluate(
      (element, attributeName, attributeValue) => {
        element?.setAttribute(attributeName, attributeValue);
      },
      element,
      mutation.attributeName,
      mutation.attributeValue
    );
  }
};
