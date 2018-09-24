/*
 * Most of this code was taken from the GeeksforGeeks pages covering
 * Doubly Linked Lists. It's similar to the contents of lib/main.c in
 * the /chapter-07-cook-the-books directory.
 * @link https://www.geeksforgeeks.org/doubly-linked-list
 * @link https://www.geeksforgeeks.org/delete-a-node-in-a-doubly-linked-list
 */
#include <stdlib.h>

struct Node {
  int id;
  int categoryId;
  float amount;
  struct Node *next;
  struct Node *prev;
};

// Initialize the linked lists when the module loads. These represents the
// first or "head" nodes for the transactions and categories lists.
struct Node *transactionsHead = NULL;
struct Node *categoriesHead = NULL;

/*
 * Removes a node from the linked list.
 */
void deleteNode(struct Node **headNode, struct Node *delNode) {
    // Base case:
    if (*headNode == NULL || delNode == NULL) return;

    // If node to be deleted is head node:
    if (*headNode == delNode) *headNode = delNode->next;

    // Change next only if node to be deleted is NOT the last node:
    if (delNode->next != NULL) delNode->next->prev = delNode->prev;

    // Change prev only if node to be deleted is NOT the first node:
    if (delNode->prev != NULL) delNode->prev->next = delNode->next;

    // Finally, free the memory occupied by delNode:
    free(delNode);
}

/*
 * Adds a node to the end of the linked list.
 */
void appendNode(struct Node **headNode, int id, int categoryId,
                float amount) {
    // 1. Allocate node:
    struct Node *newNode = (struct Node *) malloc(sizeof(struct Node));
    struct Node *last = *headNode; // Used in Step 5

    // 2. Populate with data:
    newNode->id = id;
    newNode->categoryId = categoryId;
    newNode->amount = amount;

    // 3. This new node is going to be the last node, so make next NULL:
    newNode->next = NULL;

    // 4. If the Linked List is empty, then make the new node as head:
    if (*headNode == NULL) {
        newNode->prev = NULL;
        *headNode = newNode;
        return;
    }

    // 5. Otherwise, traverse till the last node:
    while (last->next != NULL) {
        last = last->next;
    }

    // 6. Change the next of last node:
    last->next = newNode;

    // 7. Make last node as previous of new node:
    newNode->prev = last;
}

/*
 * Returns a node from the linked list that corresponds with the specified
 * ID. Since we have 2 linked lists, one for transactions, and one for
 * category totals, we can use this method to find either one.
 */
struct Node *findNodeById(int id, struct Node *withinNode) {
    struct Node *node = withinNode;
    while (node != NULL) {
        if (node->id == id) return node;
        node = node->next;
    }
    return NULL;
}

/*
 * Add a new node (transaction) to the local transactions linked list.
 */
void addTransaction(int id, int categoryId, float amount) {
    appendNode(&transactionsHead, id, categoryId, amount);
}

/*
 * Update an existing node (transaction) in the local transactions linked
 * list.
 */
void editTransaction(int id, int categoryId, float amount) {
    struct Node *foundNode = findNodeById(id, transactionsHead);
    if (foundNode != NULL) {
        foundNode->categoryId = categoryId;
        foundNode->amount = amount;
    }
}

/*
 * Removes the node from the local transactions linked list that
 * corresponds with the specified ID.
 */
void removeTransaction(int id) {
    struct Node *foundNode = findNodeById(id, transactionsHead);
    if (foundNode != NULL) deleteNode(&transactionsHead, foundNode);
}

/*
 * Attempts to find an existing node associated with the specified
 * category ID. If found, increments the amount by the value specified
 * as an argument. If not found, appends it as a new node to the
 * categories linked list.
 */
void upsertCategoryNode(int categoryId, float transactionAmount) {
    struct Node *foundNode = findNodeById(categoryId, categoriesHead);
    if (foundNode != NULL) {
        foundNode->amount += transactionAmount;
    } else {
        appendNode(&categoriesHead, categoryId, categoryId,
            transactionAmount);
    }
}

/*
 * Loops through the transactions list and either adds a node
 * representing the category associated with that transaction to the
 * categories linked list or increments the amount in the existing
 * category record.
 */
void buildValuesByCategoryList() {
    struct Node *node = transactionsHead;
    while (node != NULL) {
        upsertCategoryNode(node->categoryId, node->amount);
        node = node->next;
    }
}

/*
 * Force recalculation for each of the categories for the current
 * transaction values.
 */
void recalculateForCategories() {
    categoriesHead = NULL;
    buildValuesByCategoryList();
}

/*
 * Returns the total amount of all transactions associated with the
 * specified category ID.
 */
float getTotalForCategory(int categoryId) {
    if (categoriesHead == NULL) buildValuesByCategoryList();

    struct Node *categoryNode = findNodeById(categoryId, categoriesHead);
    if (categoryNode == NULL) return 0;

    return categoryNode->amount;
}

/*
 * Returns the grand total (sum of amount) of all transactions.
 */
float getGrandTotal() {
    struct Node *node = transactionsHead;
    float totalAmount = 0;
    while (node != NULL) {
        totalAmount += node->amount;
        node = node->next;
    }
    return totalAmount;
}
