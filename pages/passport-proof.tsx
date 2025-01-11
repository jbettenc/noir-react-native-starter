/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Share, Alert, StyleSheet} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {
  clearCircuit,
  extractProof,
  generateProof,
  setupCircuit,
  verifyProof,
} from '../lib/noir';
// Get the circuit to load for the proof generation
// Feel free to replace this with your own circuit
import circuit from '../circuits/passport/integrity_sig.json';
import {formatProof} from '../lib';
import {Circuit} from '../types';

const sampleObject = {
  current_date: '20241228', // yyyyMMdd
  dg1: [
    97, 91, 95, 31, 88, 80, 79, 67, 72, 78, 83, 72, 73, 60, 60, 74, 73, 78, 60,
    60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
    60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 69, 65, 52, 54, 48, 54, 51, 49,
    56, 50, 67, 72, 78, 57, 49, 48, 57, 48, 49, 48, 77, 50, 55, 48, 54, 49, 53,
    53, 77, 75, 75, 80, 76, 78, 80, 73, 60, 60, 60, 60, 65, 57, 49, 52, 0, 0,
  ],
  signed_attributes: [
    49, 105, 48, 24, 6, 9, 42, 134, 72, 134, 247, 13, 1, 9, 3, 49, 11, 6, 9, 42,
    134, 72, 134, 247, 13, 1, 7, 1, 48, 28, 6, 9, 42, 134, 72, 134, 247, 13, 1,
    9, 5, 49, 15, 23, 13, 49, 55, 48, 54, 49, 54, 48, 51, 50, 53, 53, 48, 90,
    48, 47, 6, 9, 42, 134, 72, 134, 247, 13, 1, 9, 4, 49, 34, 4, 32, 71, 237,
    37, 185, 225, 152, 216, 49, 203, 200, 175, 243, 5, 137, 247, 126, 102, 22,
    111, 158, 37, 214, 118, 167, 88, 56, 236, 24, 231, 61, 71, 173, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  signed_attributes_size: 107,
  e_content: [
    48, 129, 216, 2, 1, 0, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 1, 5, 0,
    48, 129, 195, 48, 37, 2, 1, 1, 4, 32, 181, 220, 114, 0, 252, 135, 45, 174,
    187, 68, 179, 177, 242, 195, 74, 180, 35, 122, 57, 18, 88, 139, 209, 149,
    127, 230, 207, 19, 217, 163, 35, 228, 48, 37, 2, 1, 2, 4, 32, 173, 166, 26,
    166, 96, 154, 130, 77, 185, 101, 246, 249, 96, 180, 25, 155, 82, 186, 239,
    100, 241, 194, 234, 45, 200, 68, 19, 134, 239, 217, 240, 181, 48, 37, 2, 1,
    11, 4, 32, 201, 140, 12, 48, 88, 27, 116, 253, 6, 128, 82, 113, 213, 182, 6,
    189, 129, 0, 46, 157, 187, 129, 228, 189, 121, 160, 127, 184, 141, 3, 191,
    210, 48, 37, 2, 1, 12, 4, 32, 174, 75, 186, 1, 91, 57, 29, 248, 158, 227,
    54, 92, 140, 24, 79, 252, 249, 187, 126, 130, 90, 48, 7, 123, 115, 135, 114,
    120, 151, 78, 122, 40, 48, 37, 2, 1, 15, 4, 32, 18, 77, 65, 189, 173, 229,
    165, 15, 36, 154, 103, 62, 62, 11, 81, 117, 115, 112, 3, 218, 135, 121, 249,
    14, 64, 5, 51, 104, 200, 23, 47, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  e_content_size: 219,
  dg1_offset_in_e_content: 31,
  pub_key_x: [
    63, 85, 200, 101, 179, 88, 186, 24, 128, 112, 30, 188, 58, 112, 119, 97,
    106, 142, 190, 148, 106, 208, 6, 103, 12, 9, 123, 90, 178, 40, 104, 232,
  ],
  pub_key_y: [
    2, 85, 152, 84, 7, 54, 210, 225, 120, 101, 145, 178, 115, 182, 91, 115, 14,
    77, 189, 152, 228, 197, 115, 72, 192, 253, 100, 220, 229, 255, 37, 252,
  ],
  document_number_hash: [
    115, 157, 191, 110, 166, 189, 241, 13, 127, 9, 30, 234, 58, 167, 193, 234,
    239, 156, 223, 167, 82, 234, 202, 36, 193, 51, 75, 104, 22, 131, 4, 242,
  ],
  signature: [
    70, 1, 42, 31, 30, 243, 130, 38, 88, 192, 95, 142, 243, 161, 3, 226, 222,
    192, 29, 100, 231, 235, 21, 39, 220, 180, 216, 253, 241, 52, 168, 131, 40,
    86, 162, 10, 31, 27, 47, 49, 125, 153, 72, 116, 60, 191, 187, 232, 210, 113,
    125, 228, 218, 242, 222, 56, 13, 96, 136, 60, 252, 85, 182, 104,
  ],
};

export default function PassportProof() {
  const [proofAndInputs, setProofAndInputs] = useState('');
  const [proof, setProof] = useState('');
  const [vkey, setVkey] = useState('');
  const [generatingProof, setGeneratingProof] = useState(false);
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [provingTime, setProvingTime] = useState(0);
  const [circuitId, setCircuitId] = useState<string>();

  useEffect(() => {
    // First call this function to load the circuit and setup the SRS for it
    // Keep the id returned by this function as it is used to identify the circuit
    setupCircuit(circuit as unknown as Circuit).then(id => setCircuitId(id));
    return () => {
      if (circuitId) {
        // Clean up the circuit after the component is unmounted
        clearCircuit(circuitId);
      }
    };
  }, []);

  const onGenerateProof = async () => {
    setGeneratingProof(true);
    try {
      // You can also preload the circuit separately using this function
      // await preloadCircuit(circuit);
      const start = Date.now();
      const {proofWithPublicInputs, vkey: _vkey} = await generateProof(
        sampleObject,
        circuitId!,
      );
      //   const end = Date.now();
      //   setProvingTime(end - start);
      //   setProofAndInputs(proofWithPublicInputs);
      //   setProof(
      //     extractProof(circuit as unknown as Circuit, proofWithPublicInputs),
      //   );
      //   setVkey(_vkey);
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setGeneratingProof(false);
  };

  const onVerifyProof = async () => {
    setVerifyingProof(true);
    try {
      // No need to provide the circuit here, as it was already loaded
      // during the proof generation
      const verified = await verifyProof(proofAndInputs, vkey, circuitId!);
      if (verified) {
        Alert.alert('Verification result', 'The proof is valid!');
      } else {
        Alert.alert('Verification result', 'The proof is invalid');
      }
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setVerifyingProof(false);
  };

  return (
    <MainLayout canGoBack={true}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          marginBottom: 20,
          textAlign: 'center',
          color: '#6B7280',
        }}>
        Generate a proof for sample passport data
      </Text>
      {proof && (
        <>
          <Text style={styles.sectionTitle}>Proof</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              textAlign: 'center',
              color: '#6B7280',
              marginBottom: 20,
            }}>
            {formatProof(proof)}
          </Text>
        </>
      )}
      {proof && (
        <>
          <Text style={styles.sectionTitle}>Proving time</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              textAlign: 'center',
              color: '#6B7280',
              marginBottom: 20,
            }}>
            {provingTime} ms
          </Text>
        </>
      )}
      {!proof && (
        // The button is disabled as long as the circuit has not been setup
        // i.e. the circuitId is not defined
        <Button
          disabled={generatingProof || !circuitId}
          onPress={() => {
            onGenerateProof();
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            {generatingProof ? 'Proving...' : 'Generate a proof'}
          </Text>
        </Button>
      )}
      {proof && (
        <View
          style={{
            gap: 10,
          }}>
          <Button
            disabled={verifyingProof}
            onPress={() => {
              onVerifyProof();
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '700',
              }}>
              {verifyingProof ? 'Verifying...' : 'Verify the proof'}
            </Text>
          </Button>
          <Button
            theme="secondary"
            onPress={() => {
              Share.share({
                title: 'My Noir React Native proof',
                message: proof,
              });
            }}>
            <Text
              style={{
                color: '#151628',
                fontWeight: '700',
              }}>
              Share my proof
            </Text>
          </Button>
        </View>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#151628',
    fontSize: 16,
    marginBottom: 5,
  },
});
