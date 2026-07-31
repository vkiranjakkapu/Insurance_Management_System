package com.ims.policies.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ims.policies.exception.ResourceNotFoundException;
import com.ims.policies.models.Document;
import com.ims.policies.repository.DocumentRepository;
import com.ims.policies.service.imp.DocumentServiceImp;

@ExtendWith(MockitoExtension.class)
class DocumentServiceImpTest {

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private DocumentServiceImp service;

    private Document document;

    @BeforeEach
    void setUp() {

        document = new Document();
        document.setId(1L);
        document.setDeleted(false);
    }

    @Test
    void shouldReturnDocumentById() {

        when(documentRepository.findById(1L))
                .thenReturn(Optional.of(document));

        Document result = service.getDocumentById(1L);

        assertSame(document, result);

        verify(documentRepository).findById(1L);
    }

    @Test
    void shouldThrowWhenDocumentNotFound() {

        when(documentRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getDocumentById(1L));

        verify(documentRepository).findById(1L);
    }

    @Test
    void shouldCreateDocument() {

        when(documentRepository.save(document))
                .thenReturn(document);

        Document result = service.createDocument(document);

        assertSame(document, result);

        verify(documentRepository).save(document);
    }

    @Test
    void shouldDeleteDocument() {

        when(documentRepository.save(document))
                .thenReturn(document);

        boolean result = service.deleteDocument(document);

        assertTrue(result);
        assertTrue(document.isDeleted());

        verify(documentRepository).save(document);
    }

    @Test
    void shouldMarkDocumentAsDeletedBeforeSaving() {

        service.deleteDocument(document);

        assertEquals(true, document.isDeleted());

        verify(documentRepository).save(document);
    }
}