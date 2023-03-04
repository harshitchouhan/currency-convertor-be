interface StoredProcedureParameters {
  name: string;
  type: any;
  variableType: 'IN' | 'OUT' | 'INOUT';
  value?: any;
}

export default StoredProcedureParameters;
