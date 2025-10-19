import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

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

const CREATE_INTERN_MUTATION = gql`
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

export function useCreateIntern() {
  const [mutate, { data, loading, error }] = useMutation<CreateInternResponse>(
    CREATE_INTERN_MUTATION
  );

  const createIntern = async (input: CreateInternInput, token?: string) => {
    const result = await mutate({
      variables: { input },
      context: {
        token,
      },
    });

    if (
      result.data?.createIntern.errors &&
      result.data.createIntern.errors.length > 0
    ) {
      throw new Error(result.data.createIntern.errors.join(", "));
    }

    if (!result.data?.createIntern.intern) {
      throw new Error("インターン生の作成に失敗しました");
    }

    return result.data.createIntern.intern;
  };

  return {
    createIntern,
    loading,
    error,
    data: data?.createIntern.intern,
  };
}
