import { graphqlClient } from "../client";

export interface CreateInternInput {
  firebaseUid: string;
  name: string;
  email: string;
  schoolName: string;
  majorName: string;
  fieldOfStudyId: string;
  schoolYearId: string;
}

export interface Intern {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  schoolName: string;
  majorName: string;
  fieldOfStudyId: string;
  schoolYearId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateInternResponse {
  createIntern: {
    intern: Intern | null;
    errors: string[];
  };
}

const CREATE_INTERN_MUTATION = `
  mutation CreateIntern($input: CreateInternInput!) {
    createIntern(input: $input) {
      intern {
        id
        firebaseUid
        name
        email
        schoolName
        majorName
        fieldOfStudyId
        schoolYearId
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export async function createIntern(
  input: CreateInternInput,
  token?: string
): Promise<Intern> {
  const response = await graphqlClient<CreateInternResponse>(
    CREATE_INTERN_MUTATION,
    { input },
    token
  );

  if (response.createIntern.errors.length > 0) {
    throw new Error(response.createIntern.errors.join(", "));
  }

  if (!response.createIntern.intern) {
    throw new Error("インターン生の作成に失敗しました");
  }

  return response.createIntern.intern;
}
