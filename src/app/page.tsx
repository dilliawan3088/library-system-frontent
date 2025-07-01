'use client';

import { useState } from 'react';

const BASE_URL = 'http://127.0.0.1:8002';

export default function Home() {
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  const getValue = (id: string): string => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
    return el?.value || '';
  };

  const callAPI = async (
    method: string,
    endpoint: string,
    data: string | null,
    outputId: string
  ) => {
    setOutputs((prev) => ({ ...prev, [outputId]: 'Loading...' }));
    try {
      const res = await fetch(BASE_URL + endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data && method !== 'GET' && method !== 'DELETE' ? data : null,
      });

      const contentType = res.headers.get('content-type');
      const result =
        contentType && contentType.includes('application/json')
          ? await res.json()
          : await res.text();

      setOutputs((prev) => ({
        ...prev,
        [outputId]: JSON.stringify(result, null, 2),
      }));
    } catch (err: any) {
      setOutputs((prev) => ({
        ...prev,
        [outputId]: '❌ Error: ' + err.message,
      }));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">📚 Smart Library System</h1>

        {/* Root */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => callAPI('GET', '/', null, 'rootOutput')}
        >
          Check Backend Status
        </button>
        <pre className="bg-blue-100 p-3 rounded mb-8 whitespace-pre-wrap">
          {outputs['rootOutput']}
        </pre>

        {/* Books Section */}
        <h2 className="text-xl font-semibold mb-4">📘 Books</h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => callAPI('GET', '/books/', null, 'booksOutput')}
        >
          Get All Books
        </button>

        <h3 className="font-semibold">Create Book</h3>
        <textarea
          id="createBook"
          className="border w-full p-2 rounded mb-2"
          placeholder='{"title":"Book Name", "author":"Author", "description":"Optional"}'
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            callAPI('POST', '/books/', getValue('createBook'), 'booksOutput')
          }
        >
          Create Book
        </button>

        <h3 className="font-semibold">Update Book</h3>
        <input
          id="updateBookId"
          className="border w-full p-2 rounded mb-2"
          placeholder="Enter Book ID to Update"
        />
        <textarea
          id="updateBook"
          className="border w-full p-2 rounded mb-2"
          placeholder='{"title":"Updated Title", "author":"New Author", "description":"Updated Description"}'
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            callAPI(
              'PUT',
              '/books/' + getValue('updateBookId'),
              getValue('updateBook'),
              'booksOutput'
            )
          }
        >
          Update Book
        </button>

        <h3 className="font-semibold">Delete Book</h3>
        <input
          id="deleteBookId"
          className="border w-full p-2 rounded mb-2"
          placeholder="Enter Book ID to Delete"
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            callAPI(
              'DELETE',
              '/books/' + getValue('deleteBookId'),
              null,
              'booksOutput'
            )
          }
        >
          Delete Book
        </button>

        <pre className="bg-blue-100 p-3 rounded mb-8 whitespace-pre-wrap">
          {outputs['booksOutput']}
        </pre>

        {/* Users Section */}
        <h2 className="text-xl font-semibold mb-4">👤 Users</h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => callAPI('GET', '/users/', null, 'usersOutput')}
        >
          Get All Users
        </button>

        <textarea
          id="createUser"
          className="border w-full p-2 rounded mb-2"
          placeholder='{"name":"User Name", "email":"user@example.com"}'
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            callAPI('POST', '/users/', getValue('createUser'), 'usersOutput')
          }
        >
          Create User
        </button>

        <pre className="bg-blue-100 p-3 rounded mb-8 whitespace-pre-wrap">
          {outputs['usersOutput']}
        </pre>

        {/* Borrow Book */}
        <h2 className="text-xl font-semibold mb-4">📖 Borrow Book</h2>
        <textarea
          id="borrowData"
          className="border w-full p-2 rounded mb-2"
          placeholder='{"user_id":1, "book_id":2, "borrow_date":"2025-06-27"}'
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            callAPI('POST', '/borrow/', getValue('borrowData'), 'borrowOutput')
          }
        >
          Borrow Book
        </button>
        <pre className="bg-blue-100 p-3 rounded mb-8 whitespace-pre-wrap">
          {outputs['borrowOutput']}
        </pre>

        {/* Recommendation */}
        <h2 className="text-xl font-semibold mb-4">💡 Book Recommendation</h2>
        <input
          type="text"
          id="preference"
          className="border w-full p-2 rounded mb-2"
          placeholder="Enter your book preference"
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            callAPI(
              'POST',
              '/recommendations/',
              JSON.stringify({ preference: getValue('preference') }),
              'recommendOutput'
            )
          }
        >
          Get Recommendations
        </button>
        <pre className="bg-blue-100 p-3 rounded mb-4 whitespace-pre-wrap">
          {outputs['recommendOutput']}
        </pre>
      </div>
    </main>
  );
}
